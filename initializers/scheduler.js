'use strict'
const ActionHero = require('actionhero')
const schedule = require("node-schedule")

module.exports = class MyInitializer extends ActionHero.Initializer {
  constructor () {
    super()
    this.name = 'scheduler'
    this.loadPriority = 1300
    this.startPriority = 1300
    this.stopPriority = 1300
  }

  async initialize () {
    ActionHero.api['scheduler'] = {
      scheduledJobs: []
    }
  }

  async start () {
    let api = ActionHero.api

    api.scheduler.scheduledJobs.push(schedule.scheduleJob(
        "0 * * * * *",
        async () => {
          let api = ActionHero.api
          if(api.resque.scheduler && api.resque.scheduler.master){
            await api.tasks.enqueue("offersHistory")
          }
    }))

    api.scheduler.scheduledJobs.push(schedule.scheduleJob(
        "0 */30 * * * *",
        async () => {
            let api = ActionHero.api
            if(api.resque.scheduler && api.resque.scheduler.master){
                await api.tasks.enqueue("updateAllAccountsBalance")
            }
        }
    ))

  }

  async stop () {}
}
