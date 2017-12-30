'use strict'

const Sequelize = require("sequelize")

module.exports = {
  loadPriority: 1100,
  startPriority: 1100,
  stopPriority: 1100,
  initialize: function (api, next) {
    api.log("Initializing database","info")
    api.database = new Sequelize(
        api.config.database.database,
        api.config.database.username,
        api.config.database.password,{
          host: api.config.database.host,
          dialect: api.config.database.dialect,
          logging: api.log
        })
    return next()
  },
  start: function (api, next) {
    api.log("Synchronyzing database","info")
    return api.database.authenticate().then(() =>
              api.database.sync().then(() =>
                  next()))
  },
  stop: function (api, next) {
    return next()
  }
}
