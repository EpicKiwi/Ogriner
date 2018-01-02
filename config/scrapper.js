'use strict'

exports['default'] = {
    scrapper: (api) => {

        return {
            loadDelay: 500,
            takeScreenshots: false,
            screenshotsLocation: "./screenshots",
            representativeThresholds: {
                ogrin: 10000,
                kama: 10000000
            },
            maxRetryAttempts: 5
        }
    }
}