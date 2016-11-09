import Crypto from './Crypto'
import Timer from './Timer'

class Authenticator {
  constructor () {
    this.period = 10
    this.crypto = new Crypto()
    this.timer = new Timer(this.period)
    this.$secret = $('.secret')
    this.$token = $('.token')
  }

  start () {
    this.crypto.generateKey().then(key => {
      this.key = key
      const percentage = this.getPercentage()
      const currentStep = percentage * this.period / 100
      this.timer.setStep(Math.ceil(currentStep))
      const delay = (1 - (currentStep % 1)) * 1000

      console.log(percentage)
      console.log(currentStep)
      console.log(Math.ceil(currentStep))
      console.log(delay)

      setTimeout(() => {
        this.timer.start()
        this.refreshToken()
        setInterval(() => {
          this.refreshToken()
        }, this.period * 1000)
      }, delay)

      this.refreshToken()

      this.crypto.exportKey(key).then(keydata => {
        this.secret = this.crypto.encodeKey(keydata)
        this.$secret.text(this.secret)
      })
    })

    this.$secret.on('input', () => {
      const secret = this.$secret.text()
      const buffer = this.crypto.decodeKey(secret)
      this.crypto.importKey(buffer).then(key => {
        this.key = key
        this.secret = secret
        this.refreshToken()
      }).catch(() => {
        // todo
        this.$secret.css('border-color', '#e16057')
      })
    })
  }

  getPercentage () {
    const now = Date.now() / 1000
    return (now / this.period - Math.floor(now / this.period)) * 100
  }

  refreshToken () {
    this.crypto.generateTimeBasedToken(this.key, this.period).then(token => {
      this.$token.text(token)
      // todo Highlight the token
    })
  }
}

export default Authenticator
