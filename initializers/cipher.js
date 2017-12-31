'use strict'
const ActionHero = require('actionhero')
const fs = require("fs")
const crypto = require("crypto")

module.exports = class CipherInitilizer extends ActionHero.Initializer {
  constructor () {
    super()
    this.name = 'cipher'
    this.loadPriority = 1010
    this.startPriority = 1010
    this.stopPriority = 1010
    this.cipherKey = {
      key: null,
      fingerprint: null
    }
  }

  async initialize () {

      ActionHero.api['cipher'] = {
        decryptString(encryptedString){
          return this.cipher.update(encryptedString)
        },
        encryptString(rawString){
          return this.decipher.update(rawString)
        },
        generateKey() {
          let key = crypto.randomBytes(ActionHero.api.config.security.accountsCipher.keyLength)
              .toString("base64")
          return {key:key}
        },
        computeFingerprint(key){
          return crypto.createHash("sha256").update(key).digest("base64")
        }
      }

    let keyLocation = ActionHero.api.config.security.accountsCipher.keyLocation
    try {
      fs.accessSync(keyLocation,fs.constants.W_OK)
    } catch(e) {
      ActionHero.api.log(`Generating new cipher key in ${keyLocation}`)
      fs.writeFileSync(keyLocation,JSON.stringify(ActionHero.api.dofusAccount.generateKey()))
    }

    this.cipherKey = JSON.parse(fs.readFileSync(keyLocation))
    this.cipherKey.fingerprint = ActionHero.api.cipher.computeFingerprint(this.cipherKey.key)
    this.cipher = crypto.createCipher("aes128",this.cipherKey.key)
    this.decipher = crypto.createDecipher("aes128",this.cipherKey.key)

    ActionHero.api.log(`Loaded cipher key, fingerprint : ${this.cipherKey.fingerprint}`)
    ActionHero.api.cipher.fingerprint = this.cipherKey.fingerprint
  }

  async start () {}
  async stop () {}
}
