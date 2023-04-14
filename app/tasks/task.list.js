class TaskList {
    constructor(tasks){
        this.tasks = tasks || [];
    }
    /**
     * Get all tasks from the list
     * @returns tasks
     */
    getTasks(){
        return this.tasks;
    }
    /**
     * Add a new task in tasks array
     * @param {*} task 
     */
    append(task){
        this.tasks.push(task)
    }
    /**
     * get all tasks marked as pending
     * @returns tasks
     */
    getPendingTasks(){
        return this.tasks.filter(task => task.status === 'pending');
    }
    /**
     * get all tasks marked as started
     * @returns tasks
     */
    getStartedTasks(){
        return this.tasks.filter(task => task.status === 'started');
    }
    /**
     * get all tasks marked as finished
     * @returns tasks
     */
    getFinishedTasks(){
        return this.tasks.filter(task => task.status === 'finished');
    }
}

module.exports = TaskList