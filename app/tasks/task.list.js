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

    getStartedTasks(){
        return this.tasks.filter(task => task.status === 'started');
    }

    getFinishedTasks(){
        return this.tasks.filter(task => task.status === 'finished');
    }
}

module.exports = TaskList