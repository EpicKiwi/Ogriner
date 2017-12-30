'use strict'

const Sequelize = require("sequelize")

module.exports = {
  loadPriority: 1110,
  startPriority: 1110,
  stopPriority: 1110,
  initialize: function (api, next) {
    api.user = {
      model: api.database.define("user", {
          email: { type: Sequelize.STRING },
          password: { type: Sequelize.STRING }
      })
    }

    return next()
  },
  start: function (api, next) {
    return next()
  },
  stop: function (api, next) {
    return next()
  }
}
