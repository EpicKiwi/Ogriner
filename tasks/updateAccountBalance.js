'use strict'
const ActionHero = require('actionhero')
const Sequelize = require("sequelize")
const Op = Sequelize.Op

exports.UpdateAccountBalance = class UpdateAccountBalance extends ActionHero.Task {
  constructor () {
    super()
    this.name = 'updateAccountBalance'
    this.description = 'Update the balance of a dofus account'
    this.frequency = -1
    this.queue = 'browser'
    this.middleware = []
  }

  async run (params) {
    if(!params || !params.accountId)
      throw new Error("No account id specified for update")

    let browser = ActionHero.api.dofusBrowser
    let account = await ActionHero.api.dofusAccount.model.findById(params.accountId)

    if(!account)
        throw new Error("Account not found")

    ActionHero.api.log(`Updating account balance ${account.username}`)

    if(account.keyFingerprint !== ActionHero.api.cipher.cipherKey.fingerprint){
      await ActionHero.api.dofusAccount.invalidCredentials(account)
      throw new Error("Invalid key fingerprint, the cipher key may have changed.")
    }
    ActionHero.api.log(`Decrypting password`,'debug')
    let password = ActionHero.api.cipher.decryptString(account.password)

    ActionHero.api.log(`Logging in`,'debug')
    try {
        await browser.login(account.username, password)
    } catch(e){
        await ActionHero.api.dofusAccount.invalidCredentials(account)
        throw new Error(`Can't login to account ${account.username}`)
    }
    account.nickname = browser.getCredentials().nickname

    ActionHero.api.log(`Checking maintenance`,'debug')
    if (await browser.checkMaintenance())
      throw new Error("Dofus bak is in maintenance mode")

    ActionHero.api.log(`Select default server`,'debug')
    let availableServers = await browser.getServerList()
    await browser.selectServer(availableServers[0].id)

    ActionHero.api.log(`Scrapping accounts`,'debug')
    let bank = await browser.getBank()

    account.ogrinBalance = bank.ogrins.amount
    account.linkedOgrinBalance = bank.ogrins.linked
    account.lastCheck = Date.now()
    await account.save()

    let balances = await account.getKamaBalances()

    for(let serverBalance of bank.servers){
        let balance = balances.find(el => el.serverName === serverBalance.name)
        if(balance){
          balance.kamaBalance = serverBalance.kamas
          balance.waitingKamaBalance = serverBalance.waitingKamas
          await balance.save()
        } else {
          balance = await ActionHero.api.kamaBalance.model.create({
              serverName: serverBalance.name,
              kamaBalance: serverBalance.kamas,
              waitingKamaBalance: serverBalance.waitingKamas
          })
          await account.addKamaBalance(balance)
        }
    }

    ActionHero.api.log(`Logging out`,'debug')
    await browser.logout()
    ActionHero.api.log(`Updated account balance ${account.username}`)
  }
}

exports.UpdateAllAccounts = class UpdateAllAccounts extends ActionHero.Task {
    constructor () {
        super()
        this.name = 'updateAllAccountsBalance'
        this.description = 'Update the balance of all the dofus accounts'
        this.frequency = 1800000
        this.queue = 'low'
        this.middleware = []
    }

    async run () {
        let accounts = await ActionHero.api.dofusAccount.model.findAll({
            where: { invalidCredentials: { [Op.ne]: true }}
        })
        ActionHero.api.log(`Updating ${accounts.length} accounts balance`)
        accounts.forEach(account => {
            ActionHero.api.tasks.enqueue("updateAccountBalance",{accountId:account.id})
        })
    }
}