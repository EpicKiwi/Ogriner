'use strict'
const ActionHero = require('actionhero')
const Sequelize = require("sequelize")
const crypto = require("crypto")

module.exports = class MyInitializer extends ActionHero.Initializer {
  constructor () {
    super()
    this.name = 'user'
    this.loadPriority = 1110
    this.startPriority = 1110
    this.stopPriority = 1110
  }

  async initialize () {
    ActionHero.api['user'] = {
        model: ActionHero.api.database.define("user", {
            email: { type: Sequelize.STRING },
            password: { type: Sequelize.STRING }
        }),
        hashPassword(rawPassword) {
            const hash = crypto.createHash("sha256")
            hash.update(rawPassword)
            return hash.digest("hex")
        }
    }
  }

  async start () {}
  async stop () {}
}
