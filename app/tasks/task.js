class Task {
    constructor(id, title, details, status, createdAt, startedAt, finishedAt, createdBy) {
        this.id = id
        this.title = title
        this.details = details
        this.status = status
        this.createdAt = createdAt
        this.startedAt = startedAt
        this.finishedAt = finishedAt
        this.createdBy = createdBy
    }
    /**
     * Get task id
     * @returns  task id
     */
    getId() {
        return this.id
    }
    /**
     * Set an id for task
     * @param {number} id 
     */
    setId(id){
        this.id = id
    }
    /**
     * Get task title
     * @returns task title
     */
    getTitle(){
        return this.title
    }   
    /**
     * Get task details
     * @returns task details
     */
    getDetails(){
        return this.details
    }
    /**
     * Get task status
     * @returns task status
     */
    getStatus(){
        return this.status
    }
    /**
     * Set task status
     * @param {*} status 
     */
    setStatus(status){
        this.status = status
    }
    /**
     * Get creation date of the task
     * @returns task created date
     */
    getCreatedAt(){
        return this.createdAt
    }
    /**
     * Get started date of the task
     * @returns task started date
     */
    getStartedAt(){
        return this.startedAt
    }
    /**
     * Set start date
     * @param {*} startedAt 
     */
    setStartedAt(startedAt){
        this.startedAt = startedAt
    }
    /**
     * Get finishing date of task
     * @returns finished date of the task
     */
    getFinishedAt(){
        return this.finishedAt
    }
    /**
     * Set finishing date of the tassk
     * @param {*} finishedAt 
     */
    setFinishedAt(finishedAt){
        this.finishedAt = finishedAt
    }
    /**
     * Get user name who created the task
     * @returns user name who created the task
     */
    getCreatedBy(){
        return this.createdBy
    }

}

module.exports = Task