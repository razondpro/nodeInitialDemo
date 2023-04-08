const env = require('./config')
const Mongo = require('./db/mongo');
const Mysql = require('./db/mysql')
const Json = require('./db/json')

//init db's
const mysqlInstance = new Mysql(env)
mysqlInstance.init()

const mongoInstance = new Mongo(env)
mongoInstance.init()

const jsonInstance = new Json(env)
jsonInstance.init()

module.exports = {
    mysql: mysqlInstance,
    mongo: mongoInstance,
    json: jsonInstance
}