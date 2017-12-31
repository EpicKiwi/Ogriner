'use strict'
const ActionHero = require('actionhero')

module.exports = class MyInitializer extends ActionHero.Initializer {
  constructor () {
    super()
    this.name = 'authMiddleware'
    this.loadPriority = 1000
    this.startPriority = 1000
    this.stopPriority = 1000
  }

  async initialize () {

    const middleware = {
      name: this.name,
      global: true,
      preProcessor: async (data) => {

          let actionTemplate = data.actionTemplate
          let connection = data.connection

          let tokenString = connection.rawConnection.req.headers["x-auth-token"]
          if(!tokenString) {
              if(actionTemplate.auth && !actionTemplate.auth.enabled)
                  return
              connection.setStatusCode(401)
              throw new Error(connection.localize("Auth token required for this action"))
          }

          let token = await ActionHero.api.authToken.model.findOne({where:{token:tokenString}})
          let user = await token.getUser()

          user.password = undefined

          data.auth = {
            token: token,
            user: user
          }

          if(!token){
              connection.setStatusCode(401)
              throw new Error(connection.localize("Invalid auth token"))
          }

          if(!user){
              connection.setStatusCode(401)
              throw new Error(connection.localize("No user associated to this token"))
          }

          if(token.expires < Date.now()){
              connection.setStatusCode(401)
              throw new Error(connection.localize("This token has expired"))
          }

          if(actionTemplate.auth && actionTemplate.auth.admin && user.role !== "Admin"){
              connection.setStatusCode(401)
              throw new Error(connection.localize("This user is not allowed to perform this action"))
          }
      }
    }

    ActionHero.api.actions.addMiddleware(middleware)

  }

  async start () {}
  async stop () {}
}
