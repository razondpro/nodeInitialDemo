class Database {
    constructor(type){
        this.type = type
    }

    /**
     * Get database type
     * @returns database type
     */
    getType(){
        return this.type
    }
}

module.exports = Database