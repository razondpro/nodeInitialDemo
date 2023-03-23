class TaskList {
    constructor(tasks){
        this.tasks = tasks || [];
    }
    getTasks(){
        return this.tasks;
    }

    append(task){
        this.tasks.push(task)
    }
}

module.exports = TaskList