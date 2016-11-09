import base32 from 'thirty-two'
import Promise from 'bluebird'

class Crypto {
  constructor () {
    this.crypto = window.crypto || window.msCrypto
    this.algo = { name: 'HMAC', hash: { name: 'SHA-1' } }
    this.extractable = true
    this.keyUsages = ['sign', 'verify']
  }

  generateKey () {
    return this.crypto.subtle.generateKey(this.algo, this.extractable, this.keyUsages)
  }

  importKey (buffer) {
    return this.crypto.subtle.importKey('raw', buffer, this.algo, this.extractable, this.keyUsages)
  }

  exportKey (key) {
    return this.crypto.subtle.exportKey('raw', key)
  }

  sign (key, data) {
    return this.crypto.subtle.sign({ name: 'HMAC', }, key, data)
  }

  verify (key, signature, data) {
    return this.crypto.subtle.verify({ name: 'HMAC', }, key, signature, data)
  }

  encodeKey (key) {
    return base32.encode(new Uint8Array(key)).toString()
  }

  prettyEncodeKey (key) {
    return this.encodeKey(key).toLowerCase().replace(/(\w{4})/g, '$1 ').trim()
  }

  decodeKey (key) {
    const decodedKey = base32.decode(key.replace(/\W+/g, ''))
    return decodedKey
  }

  generateCounterBasedToken (key, counter) {
    const buffer = this.intToArrayBuffer(counter)
    return this.sign(key, buffer).then(buffer => {
      const signature = new Uint8Array(buffer)
      const offset = signature[19] & 0xf

      let truncated = (signature[offset] & 0x7f) << 24 |
        (signature[offset + 1] & 0xff) << 16 |
        (signature[offset + 2] & 0xff) << 8 |
        (signature[offset + 3] & 0xff)

      truncated = (truncated % 1000000).toString()

      return ('000000' + truncated).substring(truncated.length)
    })
  }

  intToArrayBuffer (n) {
    const buffer = new ArrayBuffer(4)
    let bufferView = new Uint32Array(buffer)
    bufferView[0] = n

    return buffer
  }

  verifyCounterBasedToken (token, key, counter) {
    return this.generateCounterBasedToken(key, counter).then(newToken => {
      return newToken === token
    })
  }

  generateTimeBasedToken (key, period) {
    const now = Date.now() / 1000
    const counter = Math.floor(now / period)

    return this.generateCounterBasedToken(key, counter)
  }

  verifyTimeBasedToken (token, key, period, window) {
    const now = Date.now() / 1000
    const counter = Math.floor(now / period)

    const promises = []

    for (let currentCounter = counter - window * period;
         currentCounter <= counter + window * period * 2; ++currentCounter) {
      promises.push(this.generateCounterBasedToken(key, currentCounter))
    }

    return Promise.all(promises).then(tokens => {
      for (let i = 0; i < tokens.length; ++i) {
        if (tokens[i] === token) {
          return true
        }
      }
      return false
    })
  }
}

export default Crypto
