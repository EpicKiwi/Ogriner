'use strict'
const ActionHero = require('actionhero')
const Sequelize = require("sequelize")

module.exports = class DatabaseInitializer extends ActionHero.Initializer {
  constructor () {
    super()
    this.name = 'database'
    this.loadPriority = 1100
    this.startPriority = 1100
    this.stopPriority = 1100
  }

  async initialize () {
    let api = ActionHero.api
    ActionHero.api['database'] = new Sequelize(
        api.config.database.database,
        api.config.database.username,
        api.config.database.password,{
            host: api.config.database.host,
            dialect: api.config.database.dialect,
            logging: api.log
        })
  }

  async start () {
      ActionHero.api.log("Synchronyzing database","info")
      await ActionHero.api.database.authenticate()
      await ActionHero.api.database.sync()
  }
  async stop () {}
}
