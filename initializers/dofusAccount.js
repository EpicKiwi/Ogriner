'use strict'
const ActionHero = require('actionhero')
const Sequelize = require("sequelize")

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
      model: ActionHero.api.database.define("dofusAccount",{
        username: Sequelize.STRING,
        password: Sequelize.STRING,
        keyFingerprint: Sequelize.STRING
      })
    }

    ActionHero.api.user.model.hasMany(ActionHero.api.dofusAccount.model)
  }

  async start () {}
  async stop () {}
}
