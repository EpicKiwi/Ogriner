'use strict'
const ActionHero = require('actionhero')
const Sequelize = require("sequelize")
const Op = Sequelize.Op

module.exports = class MyTask extends ActionHero.Task {
  constructor () {
    super()
    this.name = 'offersHistory'
    this.description = 'an actionhero task'
    this.frequency = -1
    this.queue = 'browser'
    this.middleware = []
  }

  async run (data) {
      let browser = ActionHero.api.dofusBrowser
      let thresholds = ActionHero.api.config.scrapper.representativeThresholds
      let attempt = data.attempt ? data.attempt : 1

      ActionHero.api.log("Check new rate history value with random valid account")
      let accounts = await ActionHero.api.dofusAccount.model.findAll({
          where: { invalidCredentials: { [Op.ne]: true }}
      })

      if(accounts.length < 1){
          throw new Error("No valid Dofus account available")
      }

      let account = accounts[Math.floor(Math.random()*accounts.length)]

      ActionHero.api.log(`Check new rate history value with account ${account.username}`)
      ActionHero.api.log(`Decrypting password`,'debug')
      let password = ActionHero.api.cipher.decryptString(account.password)

      ActionHero.api.log(`Logging in`,'debug')
      try {
          await browser.login(account.username, password)
      } catch(e){
          await ActionHero.api.dofusAccount.invalidCredentials(account)
          throw new Error(`Can't login to account ${account.username}`)
      }

      ActionHero.api.log(`Checking maintenance`,'debug')
      if (await browser.checkMaintenance())
          throw new Error("Dofus bak is in maintenance mode")

      ActionHero.api.log(`Select default server`,'debug')
      let availableServers = await browser.getServerList()
      await browser.selectServer(availableServers[0].id)

      if(data.ogrin === undefined || data.ogrin){
          try {
              ActionHero.api.log(`Check new ogrin rate history value with account ${account.username}`)
              let offers = await browser.getOgrinOffers()
              ActionHero.api.log(`${offers.length} ogrin offers`)

              let representativeOffer = null
              for (let offer of offers) {
                  if (!representativeOffer || offer.ogrins > representativeOffer.ogrins)
                      representativeOffer = offer
                  if (offer.ogrins > thresholds.ogrin) {
                      representativeOffer = offer
                      break;
                  }
              }

              let register = await ActionHero.api.history.model.create({
                  date: Date.now(),
                  maxRate: this.computeMaxRate(offers),
                  minRate: this.computeMinRate(offers),
                  averageRate: this.computeAverageRate(offers),
                  representativeRate: representativeOffer.rate,
                  dataType: "Ogrin"
              })

              await register.setDofusAccount(account)
          } catch(e) {
              if(attempt <= ActionHero.api.config.scrapper.maxRetryAttempts) {
                  ActionHero.api.log("Error while updating Ogrins offers, retrying", 'error', e)
                  ActionHero.api.tasks.enqueue("offersHistory", {ogrin: true, kama: false, attempt: attempt + 1})
              } else {
                  throw e
              }
          }
      }

      if(data.kama === undefined || data.kama){
          try {
              ActionHero.api.log(`Check new kama rate history value with account ${account.username}`)
              let offers = await browser.getKamaOffers()
              ActionHero.api.log(`${offers.length} kama offers`)
              let representativeOffer = null
              for (let offer of offers) {
                  if (!representativeOffer || offer.kamas > representativeOffer.kama)
                      representativeOffer = offer
                  if (offer.kamas > thresholds.kama) {
                      representativeOffer = offer
                      break;
                  }
              }

              let register = await ActionHero.api.history.model.create({
                  date: Date.now(),
                  maxRate: this.computeMaxRate(offers),
                  minRate: this.computeMinRate(offers),
                  averageRate: this.computeAverageRate(offers),
                  representativeRate: representativeOffer.rate,
                  dataType: "Kama"
              })

              await register.setDofusAccount(account)
          } catch(e) {
              if(attempt <= ActionHero.api.config.scrapper.maxRetryAttempts) {
                  ActionHero.api.log("Error while updating Kama offers, retrying", 'error', e)
                  ActionHero.api.tasks.enqueue("offersHistory", {ogrin: false, kama: true, attempt: attempt + 1})
              } else {
                  throw e
              }
          }
      }

      await browser.logout()
  }

  computeMaxRate(offers){
    let max = -1
    for(let offer of offers){
      max = Math.max(max,offer.rate)
    }
    return max
  }

  computeMinRate(offers){
      let min = +Infinity
      for(let offer of offers){
          min = Math.min(min,offer.rate)
      }
      return min
  }

  computeAverageRate(offers){
      let sum = 0
      for(let offer of offers){
          sum += offer.rate
      }
      return sum/offers.length
  }
}
