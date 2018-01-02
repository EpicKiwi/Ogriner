'use strict'
const ActionHero = require('actionhero')

exports.Authenticate = class Authenticate extends ActionHero.Action {
  constructor () {
    super()
    this.name = 'authenticate'
    this.description = 'Authenticate a user and get an authentication token'
    this.outputExample = {
        "token": {
            "token": "8534...1c86",
            "expires": "2018-01-07T14:18:48.923Z",
            "updatedAt": "2017-12-31T14:18:49.285Z",
            "createdAt": "2017-12-31T14:18:48.925Z",
            "userId": 1
        }
    }
      this.inputs = {
          email: {
              required: true,
              validator(param,connection){
                  if(!param.match(/.+@.+\..+/)) {
                      connection.setStatusCode(400)
                      throw new Error(connection.localize("Must be a valid email address"))
                  }
              }
          },
          password: {
              required: true,
              formatter(param){
                  return ActionHero.api.user.hashPassword(param)
              }
          }
      }
      this.auth = {
        enabled: false
      }
  }

  async run ({response,params,connection}) {
      let existingUser = await ActionHero.api.user.model.findOne({where:{email: params.email}})
      if(existingUser == null || params.password !== existingUser.password) {
          connection.setStatusCode(400)
          throw new Error(connection.localize("Incorrect email or password"))
      }
      let token = await ActionHero.api.authToken.model.create({
          token: ActionHero.api.authToken.generateTokenString(),
          expires: new Date(new Date().getTime() + ActionHero.api.config.security.tokenLifetime)
      })
      await token.setUser(existingUser)

      console.log(token)
      token.dataValues["id"] = undefined
      response.token = token.dataValues
  }
}
