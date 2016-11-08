import Authenticator from './Authenticator'

const authenticator = new Authenticator()

authenticator.generateKey().then(key => {
  // console.log(key)

  authenticator.exportKey(key).then(keydata => {
    // console.log(keydata)

    const encodedKey = authenticator.encodeKey(keydata)
    // console.log(encodedKey)

    const decodedKey = authenticator.decodeKey(encodedKey)
    // console.log(decodedKey)

    authenticator.importKey(decodedKey).then(key => {
      // console.log(key)
    })
  })

  $('.generate').click(() => {
    authenticator.generateTimeBasedToken(key).then(token => {
      console.log(token)
      setTimeout(() => {
        authenticator.verifyTimeBasedToken(token, key).then(delta => {
          console.log(delta)
        })
      }, 3000)
    })
  })
})
