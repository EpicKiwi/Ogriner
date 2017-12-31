'use strict'
const ActionHero = require('actionhero')

exports.UserList = class UserList extends ActionHero.Action {
  constructor () {
    super()
    this.name = 'userList'
    this.description = 'List the users'
    this.outputExample = {
        "users": [
            {
                "id": 1,
                "email": "me@epickiwi.fr",
                "createdAt": "2017-12-30T23:43:05.570Z",
                "updatedAt": "2017-12-30T23:43:10.479Z"
            }
        ]}
  }

  async run ({response}) {
    let users = await ActionHero.api.user.model.findAll()
    response.users = users.map(user => {
      user.password = undefined
      return user
    })
  }
}

exports.OneUser = class OneUser extends ActionHero.Action {
    constructor () {
        super()
        this.name = 'oneUser'
        this.description = 'get one user'
        this.outputExample = {
            "user": {
                    "id": 1,
                    "email": "me@epickiwi.fr",
                    "createdAt": "2017-12-30T23:43:05.570Z",
                    "updatedAt": "2017-12-30T23:43:10.479Z"
            }
        }
        this.inputs = {
            id: {required: true},
        }
    }

    async run ({response,params,connection}) {
        let user = await ActionHero.api.user.model.findById(params.id)
        if(!user) {
            connection.setStatusCode(404)
            throw new Error(connection.localize("User not found"))
        }
        user.password = undefined
        response.user = user
    }
}

exports.AddUser = class AddUser extends ActionHero.Action {
    constructor () {
        super()
        this.name = 'addUser'
        this.description = 'Add a user'
        this.outputExample = {
            "users": [
                {
                    "id": 1,
                    "email": "me@epickiwi.fr",
                    "createdAt": "2017-12-30T23:43:05.570Z",
                    "updatedAt": "2017-12-30T23:43:10.479Z"
                }
            ]}

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
    }

    async run ({response,params,connection}) {
      let existingUser = await ActionHero.api.user.model.findOne({where:{email: params.email}})
      if(existingUser) {
          connection.setStatusCode(400)
          throw new Error(connection.localize("A user already exists with this email"))
      }
      let user = await ActionHero.api.user.model.create({
          email: params.email,
          password: params.password,
          role: "User"
      })
      user.password = undefined
      response.user = user
    }
}

exports.DeleteUser = class DeleteUser extends ActionHero.Action {
    constructor () {
        super()
        this.name = 'deleteUser'
        this.description = 'delete a user'
        this.outputExample = {
            "user": {
                "id": 1,
                "email": "me@epickiwi.fr",
                "createdAt": "2017-12-30T23:43:05.570Z",
                "updatedAt": "2017-12-30T23:43:10.479Z"
            }
        }
        this.inputs = {
            id: {required: true},
        }
    }

    async run ({response,params,connection}) {
        let user = await ActionHero.api.user.model.findById(params.id)
        if(!user) {
            connection.setStatusCode(404)
            throw new Error(connection.localize("User not found"))
        }
        await user.destroy()
        user.password = undefined
        response.user = user
    }
}