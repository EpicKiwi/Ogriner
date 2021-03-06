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
  }

  async initialize () {

      ActionHero.api['cipher'] = {
        encryptString(encryptedString){
          const cipher = crypto.createCipher("aes128",this.cipherKey.key)
          return cipher.update(encryptedString,"utf8","hex")+cipher.final("hex")
        },
        decryptString(rawString){
          const decipher = crypto.createDecipher("aes128",this.cipherKey.key)
          return decipher.update(rawString,"hex","utf8")+decipher.final("utf8")
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
      fs.writeFileSync(keyLocation,JSON.stringify(ActionHero.api.cipher.generateKey()))
    }

    ActionHero.api['cipher'].cipherKey = JSON.parse(fs.readFileSync(keyLocation))
    ActionHero.api['cipher'].cipherKey.fingerprint = ActionHero.api.cipher.computeFingerprint(
        ActionHero.api['cipher'].cipherKey.key)

    ActionHero.api.log(`Loaded cipher key, fingerprint : ${ActionHero.api['cipher'].cipherKey.fingerprint}`)
  }

  async start () {}
  async stop () {}
}
