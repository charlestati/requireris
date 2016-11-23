import qr from 'qr-image'
import Crypto from './Crypto'

class Authenticator {
  constructor () {
    this.period = 30
    this.crypto = new Crypto()
    this.$secret = $('.secret')
    this.$error = $('.error')
    this.$token = $('.token')
    this.$button = $('.generate')
  }

  start () {
    this.crypto.generateKey().then(key => {
      this.key = key
      this.refreshToken()
      this.crypto.exportKey(key).then(keydata => {
        this.secret = this.crypto.encodeKey(keydata)
        this.refreshQrCode(this.secret)
        this.$secret.val(this.secret)
      })
    })

    this.$secret.on('input', () => {
      const secret = this.$secret.val()
      const buffer = this.crypto.decodeKey(secret)
      this.crypto.importKey(buffer).then(key => {
        this.$error.animate({ opacity: 0, visibility: 'hidden' }, 200)
        this.key = key
        this.secret = secret
        this.refreshQrCode(this.secret)
        this.refreshToken()
      }).catch(() => {
        this.$error.css({ visibility: 'visible' }).animate({ opacity: 1 }, 200)
      })
    })

    this.$button.click(() => {
      this.refreshToken()
    })
  }

  refreshToken () {
    this.crypto.generateTimeBasedToken(this.key, this.period).then(token => {
      this.$token.text(token)
    })
  }

  refreshQrCode (secret) {
    const uri = `otpauth://totp/Requireris:requireris@google.com?secret=${secret}&issuer=Requireris`
    const code = qr.imageSync(uri, { type: 'svg' })
    $('.qrcode').html(code)
  }
}

export default Authenticator
