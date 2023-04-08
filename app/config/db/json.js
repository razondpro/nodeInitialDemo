const jDB = require('node-json-db')
const Database = require('./base')

class Json extends Database{
    constructor(envs){
        if(!Json._instance){
            super('json')
            this.connection = null
            this.envs = envs
        }
        return Json._instance
    }

    /**
     * 
     * @returns returns singleton instance
     */
    static getInstance(){
        return this._instance
    }

    /**
     * 
     * @returns return db connection
     */
    getConnection() {
        return this.connection
    }

    /**
     * Inits connection with database
     * @returns jsondb connection
     */
    init() {
        this.connection = new jDB.JsonDB(new jDB.Config(this.envs.dbName, true, false, '/'));
        return this.connection
    }

}

module.exports = Json