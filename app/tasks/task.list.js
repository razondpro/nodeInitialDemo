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

    getStartedTasks(){
        return this.tasks.filter(task => task.status === 'started');
    }
}

module.exports = TaskList