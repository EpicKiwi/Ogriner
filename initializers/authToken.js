'use strict'
const ActionHero = require('actionhero')
const Sequelize = require("sequelize")
const crypto = require("crypto")

module.exports = class AuthTokenInitializer extends ActionHero.Initializer {
  constructor () {
    super()
    this.name = 'authToken'
    this.loadPriority = 1115
    this.startPriority = 1115
    this.stopPriority = 1115
  }

  async initialize () {
    ActionHero.api['authToken'] = {

      model: ActionHero.api.database.define("authToken",{
        token: Sequelize.STRING,
        expires: Sequelize.DATE
      }),

      generateTokenString(){
        return crypto.randomBytes(ActionHero.api.config.security.tokenSize).toString("hex")
      }
    }

    ActionHero.api.authToken.model.belongsTo(ActionHero.api.user.model)

  }

  async start () {}
  async stop () {}
}
