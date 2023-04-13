const TaskMongoModel = require('../models/task.mongo.model');
const Task = require("../task");
const TaskList = require("../task.list");

class TaskMongoRepository {
  constructor() {
    this.model = TaskMongoModel;
  }
  /**
   * Calls mongoose model to save in Mongo db
   * @param {Task} task
   * @returns
   */
  async create(task) {
    const t = await this.model.create(task)
    return t
  }
  /**
   * Get all tasks
   * @returns all tasks
   */
  async findAll() {
    let tasks = new TaskList();
    const tModels = await this.model.find({});
    if (tModels.length)
      tModels.forEach((t) => tasks.append(this.convertToTask(t)));
    return tasks;
  }

  async delete(id) {
    await this.model.deleteOne({ id: id });
  }

  async update(task) {
    // const t = this.model.build(task)
    await this.model.updateOne({id: task.getId()}, task);
  }
  /**
   * Converts object from db to Task class object
   * @param {object} taskObject
   * @returns
   */
  convertToTask(taskObject) {
    let task;
    if (taskObject)
      task = new Task(
        taskObject.id,
        taskObject.title,
        taskObject.details,
        taskObject.status,
        taskObject.createdAt,
        taskObject.startedAt,
        taskObject.finishedAt,
        taskObject.createdBy
      );
    return task;
  }
}

module.exports = TaskMongoRepository;
