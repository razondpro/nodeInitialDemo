const TaskJsonModel = require('../models/task.json.model')
const Task = require('../task')
const TaskList = require('../task.list')

class TaskJsonRepository {
    constructor(){
        this.model = new TaskJsonModel()
    }
    /**
     * Calls json model to save in json db
     * @param {Task} task 
     * @returns 
     */
    async create(task) {
        await this.model.save(task)
        return task
    }
    /**
     * Finds a task by id
     * @param {number} id 
     * @returns 
     */
    async find(id){
        const task = await this.model.findOne(id)
        return this.convertToTask(task)
    }
    /**
     * Get all tasks
     * @returns all tasks
     */
    async findAll(){
        let tasks = new TaskList()
        const tModels = await this.model.findAll()
        if(tModels.length)
            tModels.forEach(t => tasks.append(this.convertToTask(t)))
        return tasks;
    }

    async delete(id){
        await this.model.delete(id)
    }

    async update(task){

    }
    /**
     * Converts object from db to Task class object
     * @param {object} taskObject 
     * @returns 
     */
    convertToTask(taskObject){
        let task
        if(taskObject)
            task = new Task(taskObject.id, 
            taskObject.title,
            taskObject.details,
            taskObject.status,
            taskObject.createdAt,
            taskObject.startedAt,
            taskObject.finishedAt,
            taskObject.createdBy 
        )
        return task
    }
}

module.exports = TaskJsonRepository