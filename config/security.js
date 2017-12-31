'use strict'

exports['default'] = {
    security: (api) => {

        return {
            tokenLifetime: 604800000,
            tokenSize: 50
        }
    }
}