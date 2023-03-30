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

    getPendingTasks(){
        return this.tasks.filter(task => task.status === 'pending');
    }
}

module.exports = TaskList