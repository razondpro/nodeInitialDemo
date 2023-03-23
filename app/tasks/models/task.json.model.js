const { json } = require('../../config/db')
const Task = require('../task')
class JsonModel {
     constructor(){
        this.tasksArray = '/tasks' // see node-json-db array conf
     }
     /**
      * Find index in json array
      * @param {number} id 
      * @returns 
      */
    async getIndex(id){
        const index =  await json.getConnection().getIndex(this.tasksArray, id)
        return index 
    }
    /**
    * Saves a task in json db
    * @param {Task} task 
    */
    async save(task){
        await json.getConnection().push(`${this.tasksArray}[]`, task, true)
    }
    /**
     * Saves task in a certain position
     * @param {Task} task 
     * @param {number} positionInArray 
     */
    async saveInPosition(task, positionInArray){
        await json.getConnection().push(`${this.tasksArray}[${positionInArray}]`, task, true)
    }
    /**
     * Find task by id
     * @param {number} id 
     * @returns 
     */
    async findOne(id){
        const index = await this.getIndex(id)
        let task
        if(index)
            task =  await json.getConnection().getData(`${this.tasksArray}[${index}]`)
        return task 
    }
    /**
     * Get all tasks
     * @returns all tasks
     */
    async findAll(){
        let tasks = []
        try{
            tasks = await json.getConnection().getData(this.tasksArray)
        }catch(err){
            throw new Error('There are no tasks')
        }
        return tasks;
    }
    /**
     * Deletes task by id
     * @param {number} id 
     */
    async delete(id) {
        const index = await this.getIndex(id)
        if(index)
            await json.getConnection().delete(`${this.tasksArray}[${index}]`)    
    }
    /**
     * Updates a task in db
     * @param {Task} task 
     */
    async update(task){
        const index = await this.getIndex(this.id)
        if(index)
            await this.saveInPosition(task, index)

    }

}


module.exports = JsonModel