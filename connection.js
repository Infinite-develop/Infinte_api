const {Client} = require('pg')

const client = new Client({
    host: "localhost",
    user: "postgres",
    port: 5432,
    password: "hamza123",
    database: "postgres"
})

module.exports = client

