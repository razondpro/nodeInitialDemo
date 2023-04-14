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
    /**
     * Get all tasks
     * @returns all tasks
     */
    async retrieveAll() {
        const t = await this.service.retrieveAll()
        return t.getTasks();
    }
    /**
     * Updates a task
     * @param {*} task 
     */
    async update(task){
        await this.service.update(task)
    }
    /**
     * deletes a task with given id
     * @param {*} id 
     */
    async delete(id){
        await this.service.delete(id)
    }
    /**
     * Get all pending tasks
     * @returns pending tasks
     */
    async getPendingTasks(){
        const tasks = await this.service.retrieveAll();
        return tasks.getPendingTasks();
    }
    /**
     * Get all started tasks
     * @returns started tasks
     */
    async getStartedTasks(){
        const tasks = await this.service.retrieveAll();
        return tasks.getStartedTasks();
    }
    /**
     * Get all finished tasks
     * @returns finished tasks
     */
    async getFinishedTasks(){
        const tasks = await this.service.retrieveAll();
        return tasks.getFinishedTasks();
    }



}

module.exports = TaskController