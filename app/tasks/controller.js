const TaskSerivice = require("./service")
const Task = require("./task")

class TaskController {
    constructor(repository) {
        this.service = new TaskSerivice(repository)
    }

    /**
     * Recieves a task and calls its service to save it
     * @param {Task} task 
     * @returns created task
     */
    async create(task) {
        const t = await this.service.create(task)
        return t
    }

    async retrieve(id){
        
    }

    async retrieveAll() {
        const t = await this.service.retrieveAll()
        return t;
    }

    async update(task){

    }

    async delete(id){
        await this.service.delete(id)
    }

    async getPendingTasks(){
        const tasks = await this.service.retrieveAll();
        return tasks.getPendingTasks();
    }



}

module.exports = TaskController