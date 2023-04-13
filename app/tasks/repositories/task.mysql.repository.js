const TaskMysqlModel = require('../models/task.mysql.model');
const Task = require("../task");
const TaskList = require("../task.list");

class TaskMysqlRepository {
  constructor() {
    this.model = TaskMysqlModel;
  }
  /**
   * Calls mysql model to save in mysql db
   * @param {Task} task
   * @returns
   */
  async create(task) {
    const t = this.model.build(task)
    await t.save()
    return t
  }
  /**
   * Get all tasks
   * @returns all tasks
   */
  async findAll() {
    let tasks = new TaskList();
    const tModels = await this.model.findAll();
    if (tModels.length)
      tModels.forEach((t) => tasks.append(this.convertToTask(t)));
    return tasks;
  }

  async delete(id) {
    await this.model.destroy({ where: { id: id } });
  }

  async update(task) {
    // const t = this.model.build(task)
    await this.model.update(task, {where: {id: task.getId()}});
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

module.exports = TaskMysqlRepository;
