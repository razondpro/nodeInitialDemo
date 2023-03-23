const TaskJsonRepository = require("./task.json.repository")


class TaskRepositoryFactory {
    static create(type){
        let rep
        switch (type){
            case 'mysql':
                break
            case 'mongo':
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