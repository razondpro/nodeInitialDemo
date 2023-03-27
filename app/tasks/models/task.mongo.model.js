const { MongoClient, ObjectId } = require('mongodb')
const Task = require('../task')

class TaskMongoModel {
  constructor(uri) {
    this.uri = uri
    this.dbName = 'mydb'
    this.collectionName = 'tasks'
  }

  async getCollection() {
    const client = await MongoClient.connect(this.uri,)
    const db = client.db(this.dbName)
    const collection = db.collection(this.collectionName)
    return { client, collection }
  }

  async save(task) {
    const { client, collection } = await this.getCollection()
    try {
      const result = await collection.insertOne(task)
      return result.insertedId
    } finally {
      client.close()
    }
  }

  async findOne(id) {
    const { client, collection } = await this.getCollection()
    try {
      const task = await collection.findOne({ _id: new ObjectId(id) })
      return task ? new Task(task.id, task.title, task.details, task.status, task.createdAt, task.startedAt, task.finishedAt, task.createdBy) : null
    } finally {
      client.close()
    }
  }

  async findAll() {
    const { client, collection } = await this.getCollection()
    try {
      const tasks = await collection.find().toArray()
      return tasks.map((task) => new Task(task.id, task.title, task.details, task.status, task.createdAt, task.startedAt, task.finishedAt, task.createdBy))
    } finally {
      client.close()
    }
  }

  async delete(id) {
    const { client, collection } = await this.getCollection()
    try {
      const result = await collection.deleteOne({ _id: new ObjectId(id) })
      return result.deletedCount
    } finally {
      client.close()
    }
  }

  async update(task) {
    const { client, collection } = await this.getCollection()
    try {
      const result = await collection.updateOne({ _id: new ObjectId(task.id) }, { $set: task })
      return result.modifiedCount
    } finally {
      client.close()
    }
  }
}

module.exports = TaskMongoModel