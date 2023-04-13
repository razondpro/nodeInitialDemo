const TaskJsonRepository = require("./task.json.repository")
const TaskMysqlRepository = require('./task.mysql.repository')
const TaskMongoRepository = require('./task.mongo.repository')


class TaskRepositoryFactory {
    static create(type){
        let rep
        switch (type){
            case 'mysql':
                rep = new TaskMysqlRepository()
                break
            case 'mongo':
                rep = new TaskMongoRepository()
                break
            case 'json':
                rep = new TaskJsonRepository()
                break
            default:
                throw new Error('Accepted Repository types: mysql, mongo, json')
        }
        return rep
    }
}

module.exports = TaskRepositoryFactory