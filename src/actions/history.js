'use strict'
const ActionHero = require('actionhero')
const Sequelize = require("sequelize")
const Op = Sequelize.Op

exports.GetPartHistory = class GetPartHistory extends ActionHero.Action {
  constructor () {
    super()
    this.name = 'getPartHistory'
    this.description = 'Get a part of history'
    this.outputExample = {}
    this.inputs = {
      type: { required: true,
              validator(param){
                let authorizedType = ["ogrins","kamas"]
                if(authorizedType.find(el => el == param))
                  throw new Error(`The type must be one of these ${authorizedType.join(",")}`)
              },
              formatter(param){
                switch(param){
                    case "ogrins":
                      return "Ogrin"
                    case "kamas":
                      return "Kama"
                }
              }},
      from: { required: true,
              validator(param){
                if(isNaN(param))
                  throw new Error("From must be a valid date "+param)
              },
              formatter(param){ return new Date(parseInt(param)) }},
      to:   { required: true,
              validator(param){
                if(isNaN(param))
                    throw new Error("To must be a valid date")
              },
              formatter(param){ return new Date(parseInt(param)) }}
    }
  }

  async run ({params,response}) {

    let timespan = params.to.getTime() - params.from.getTime()

    if(timespan > 604800000)
      throw new Error("The timespan is too large, must be lower than 7 days")

    if(timespan < 0)
        throw new Error("From must be lower than To")

    let values = await ActionHero.api.history.model.findAll({
        where: {
          dataType: params.type,
          date: {[Op.gte]:params.from,
                 [Op.lte]:params.to}
        },
        order: ["date"]
    })

    response.values = values.map( el => {
      el.dofusAccountId = undefined
      return el
    })
  }
}

exports.GetOne = class GetOne extends ActionHero.Action {
    constructor () {
        super()
        this.name = 'getOneHistoryValue'
        this.description = 'Get a part of history'
        this.outputExample = {}
        this.inputs = {
            id: {required: true}
        }
    }

    async run ({params,response}) {

        let value = await ActionHero.api.history.model.findById(params.id)

        if(!value)
          throw new Error("Value not found")

        value.dofusAccountId = undefined
        response.value = value

    }
}