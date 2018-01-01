'use strict'
const ActionHero = require('actionhero')
const dbrowser = require("Bak-scrapper")

module.exports = class MyInitializer extends ActionHero.Initializer {
  constructor () {
    super()
    this.name = 'dofusBrowser'
    this.loadPriority = 1020
    this.startPriority = 1020
    this.stopPriority = 1020
  }

  async initialize () {
    dbrowser.init(
        ActionHero.api.config.scrapper.takeScreenshots,
        ActionHero.api.config.scrapper.screenshotsLocation)
    dbrowser.setLoadingDelay(ActionHero.api.config.scrapper.loadDelay)
    ActionHero.api['dofusBrowser'] = dbrowser
  }

  async start () {}
  async stop () {}
}
