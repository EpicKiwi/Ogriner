'use strict'
const ActionHero = require('actionhero')

exports.SelfAccounts = class SelfAccounts extends ActionHero.Action {
  constructor () {
    super()
    this.name = 'selfAccounts'
    this.description = 'List all the dofus accounts registered on this user'
    this.outputExample = {
        "dofusAccounts": [
            {
                "id": 1,
                "username": "hello",
                "createdAt": "2017-12-31T16:18:50.763Z",
                "updatedAt": "2017-12-31T16:18:55.722Z",
                "userId": 1
            }
        ]
    }
  }

  async run ({auth,response}) {
    let accounts = await auth.user.getDofusAccounts()
    for(let i = 0; i<accounts.length; i++){
      let account = accounts[i]
      account.dataValues.kamaBalances = await account.getKamaBalances()
      account.password = undefined
      account.keyFingerprint = undefined
      accounts[i] = account
    }
    response.dofusAccounts = accounts
  }
}

exports.AllAccounts = class AllAccounts extends ActionHero.Action {
    constructor () {
        super()
        this.name = 'allAccounts'
        this.description = 'List all the dofus accounts'
        this.outputExample = {
            "dofusAccounts": [
                {
                    "id": 1,
                    "username": "hello",
                    "createdAt": "2017-12-31T16:18:50.763Z",
                    "updatedAt": "2017-12-31T16:18:55.722Z",
                    "userId": 1
                }
            ]
        }
        this.auth = {
          enabled: true,
          admin: true
        }
    }

    async run ({response}) {
        let accounts = await ActionHero.api.dofusAccount.model.findAll()
        for(let i = 0; i<accounts.length; i++){
            let account = accounts[i]
            account.dataValues.kamaBalances = await account.getKamaBalances()
            account.password = undefined
            account.keyFingerprint = undefined
            accounts[i] = account
        }
        response.dofusAccounts = accounts
    }
}

exports.GetOne = class GetOne extends ActionHero.Action {
    constructor () {
        super()
        this.name = 'getOneAccount'
        this.description = 'Get one dofus account'
        this.outputExample = {
          "dofusAccount" : {
              "id": 1,
              "username": "hello",
              "createdAt": "2017-12-31T16:18:50.763Z",
              "updatedAt": "2017-12-31T16:18:55.722Z",
              "userId": 1
          }
        }
        this.inputs = {
          id: {required: true}
        }
    }

    async run ({auth,response,params,connection}) {
        let account = await ActionHero.api.dofusAccount.model.findById(params.id)
        let accountUser = await account.getUser()

        if(!account ||
           !accountUser ||
         (accountUser.id !== auth.user.id && auth.user.role !== "Admin")){
          connection.setStatusCode(404)
          throw new Error(connection.localize("Dofus account not found"))
        }

        account.dataValues.kamaBalances = await account.getKamaBalances()
        account.password = undefined
        account.keyFingerprint = undefined
        response.dofusAccount = account
    }
}

exports.DeleteOne = class DeleteOne extends ActionHero.Action {
    constructor () {
        super()
        this.name = 'deleteOneAccount'
        this.description = 'Delete a dofus account'
        this.outputExample = {
            "dofusAccount" : {
                "id": 1,
                "username": "hello",
                "createdAt": "2017-12-31T16:18:50.763Z",
                "updatedAt": "2017-12-31T16:18:55.722Z",
                "userId": 1
            }
        }
        this.inputs = {
            id: {required: true}
        }
    }

    async run ({auth,response,params,connection}) {
        let account = await ActionHero.api.dofusAccount.model.findById(params.id)
        let accountUser = await account.getUser()

        if(!account ||
            !accountUser ||
            (accountUser.id !== auth.user.id && auth.user.role !== "Admin")){
            connection.setStatusCode(404)
            throw new Error(connection.localize("Dofus account not found"))
        }

        await account.destroy()

        account.password = undefined
        account.keyFingerprint = undefined
        response.dofusAccount = account
    }
}

exports.CreateOne = class CreateOne extends ActionHero.Action {
    constructor () {
        super()
        this.name = 'createOneAccount'
        this.description = 'Create a dofus account'
        this.outputExample = {
            "dofusAccount" : {
                "id": 1,
                "username": "hello",
                "createdAt": "2017-12-31T16:18:50.763Z",
                "updatedAt": "2017-12-31T16:18:55.722Z",
                "userId": 1
            }
        }
        this.inputs = {
            username: {required: true},
            password: {
              required: true,
              formatter(param) {
                return ActionHero.api.cipher.encryptString(param)
              }},
            userId: {required: false}
        }
    }

    async run ({auth,response,params,connection}) {

        let user = auth.user

        if(params.userId && user.role === "Admin"){
          user = await ActionHero.api.user.model.findById(params.userId)
          if(!user){
              connection.setStatusCode(404)
              throw new Error(connection.localize("User not found"))
          }
        }

        let account = await ActionHero.api.dofusAccount.model.create({
            username: params.username,
            password: params.password,
            keyFingerprint: ActionHero.api.cipher.cipherKey.fingerprint,
            invalidCredentials: false
        })

        await account.setUser(user)

        account.password = undefined
        account.keyFingerprint = undefined
        response.dofusAccount = account
    }
}