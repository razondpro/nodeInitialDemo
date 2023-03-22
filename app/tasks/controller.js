const TaskSerivice = require("./service")

class TaskController {
    constructor(dbType) {
        this.service = new TaskSerivice()
        this.type = dbType
    }

    async create(task) {
        //TODO
    }

    async showAll(){

    }

    async update(){

    }

    async delete(){
        
    }



}

module.exports = TaskController