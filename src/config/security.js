'use strict'

exports['default'] = {
    security: (api) => {

        return {
            tokenLifetime: 604800000,
            tokenSize: 50,
            accountsCipher: {
                keyLocation: __dirname+"/encryptionkey.json",
                keyLength: 512
            }
        }
    }
}