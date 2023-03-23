const { v4: uuidv4 } = require('uuid') 
const Task = require("./task")

class TaskSerivice{
    constructor(repository){
        this.repository = repository
    }
    /**
     * Recieves a task 
     * Sets an id for a new Task
     * Saves in db calling repository
     * @param {Task} task 
     * @returns saved task
     */
    async create(task){
        task.setId(uuidv4())
        let t = await this.repository.create(task)
        return t
    }
    /**
     * Get all tasks from db
     * @returns all tasks
     */
    async retrtieveAll(){
        let tasks = await this.repository.findAll()
        return tasks;
    }
}

module.exports = TaskSerivice