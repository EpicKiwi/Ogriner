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
        nickname: Sequelize.STRING,
        username: Sequelize.STRING,
        password: Sequelize.STRING,
        keyFingerprint: Sequelize.STRING
        invalidCredentials: Sequelize.BOOLEAN,
        ogrinBalance: Sequelize.INTEGER,
        linkedOgrinBalance: Sequelize.INTEGER
      })
    }

    ActionHero.api.user.model.hasMany(ActionHero.api.dofusAccount.model)
    ActionHero.api.dofusAccount.model.belongsTo(ActionHero.api.user.model)

    ActionHero.api['kamaBalance'] = {
        model: ActionHero.api.database.define("kamaBalance",{
            serverName: Sequelize.STRING,
            kamaBalance: Sequelize.INTEGER,
            waitingKamaBalance: Sequelize.INTEGER
        })
    }

    ActionHero.api.dofusAccount.model.hasMany(ActionHero.api.kamaBalance.model)
    ActionHero.api.kamaBalance.model.belongsTo(ActionHero.api.dofusAccount.model)
  }

  async start () {}
  async stop () {}
}
