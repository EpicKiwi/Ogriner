'use strict'
const ActionHero = require('actionhero')
const Sequelize = require('sequelize')

module.exports = class MyInitializer extends ActionHero.Initializer {
  constructor () {
    super()
    this.name = 'ogrinHistory'
    this.loadPriority = 1130
    this.startPriority = 1130
    this.stopPriority = 1130
  }

  async initialize () {
    ActionHero.api['history'] = {
      model: ActionHero.api.database.define("history", {
        date: Sequelize.DATE,
        maxRate: Sequelize.FLOAT,
        minRate: Sequelize.FLOAT,
        averageRate: Sequelize.FLOAT,
        representativeRate: Sequelize.FLOAT,
        dataType: Sequelize.ENUM("Ogrin","Kama")
      })
    }

    ActionHero.api.history.model.belongsTo(ActionHero.api.dofusAccount.model)
  }

  async start () {}
  async stop () {}
}
