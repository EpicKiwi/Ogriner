'use strict'
const ActionHero = require('actionhero')
const fs = require("fs")
const crypto = require("crypto")

module.exports = class MyInitializer extends ActionHero.Initializer {
  constructor () {
    super()
    this.name = 'dofusAccount'
    this.loadPriority = 1120
    this.startPriority = 1120
    this.stopPriority = 1120
  }

  async initialize () {

      ActionHero.api['dofusAccount'] = {
        generateKey() {
          let key = crypto.randomBytes(ActionHero.api.config.security.accountsCipher.keyLength)
              .toString("base64")
          let fingerprint = crypto.createHash("sha256").update(key).digest("base64")
          return {key:key,fingerprint:fingerprint}
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
      ActionHero.api.log(`Loaded cipher key from ${keyLocation}`)
  }

  async start () {}
  async stop () {}
}
