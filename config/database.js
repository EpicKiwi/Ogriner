exports['default'] = {
    database: function (api) {
        return {
            host: process.env.DATABASE_HOST ? process.env.DATABASE_HOST : "localhost",
            port: process.env.DATABASE_PORT ? process.env.DATABASE_PORT : 5432,
            dialect: "postgres",
            database: "ogriner",
            username: process.env.DATABASE_USERNAME ? process.env.DATABASE_USERNAME : "postgres",
            password: process.env.DATABASE_PASSWORD ? process.env.DATABASE_PASSWORD : "root"
        }
    }
}