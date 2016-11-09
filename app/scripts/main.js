import Authenticator from './Authenticator'

let authenticator

$(() => {
  authenticator = new Authenticator()
  authenticator.start()
})
