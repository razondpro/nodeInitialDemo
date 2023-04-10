const inquirer = require("inquirer");
const TaskController = require("../tasks/controller");
const TaskRepositoryFactory = require("../tasks/repositories/task.repository.factory");
const Task = require("../tasks/task");

const {
  dbSelection,
  askName,
  mainMenu,
  taskMenu,
  detailsMenu,
  askTitle,
  askDetails,
  confirmAction,
} = require("./questions");

/**
 * Initialization of main program
 */
async function initProgram() {
  const db = await inquirer.prompt([dbSelection]);
  const dbType = db.dbType.toLowerCase();

  await listMainMenu(dbType);

  process.exit(0);
}

/**
 * Lists main menu in terminal
 * @param {String} dbType
 */
async function listMainMenu(dbType) {
  const tc = new TaskController(TaskRepositoryFactory.create(dbType));
  const answer = await inquirer.prompt([askName]);
  const user = answer.name;

  let exit = false;
  while (!exit) {
    const menuOption = await inquirer.prompt([mainMenu]);
    switch (menuOption.menu) {
      case "Create a new task":
        await createNewTask(tc, user);
        break;
      case "Show tasks":
        await listTaskMenu(tc, user);
        break;
      case "Delete tasks":
        await deleteTasksMenu(tc, user);
        break;
      case "Exit":
        exit = true;
        break;
      default:
        console.log("What did you select?");
    }
  }
}
/**
 * Deletes specific task
 * @param {Object} taskToDelete
 * @param {*} taskController
 * @param {Array} taskList
 */
async function deleteTask(taskToDelete, taskController, taskList) {
  const ca = await inquirer.prompt([confirmAction]);
  if (ca.confirm) {
    await taskController.delete(taskToDelete.id);
    taskList.splice(taskList.charAt(0) - 1, 1);
    console.log("Succesfully deleted");
  }
  return taskList;
}

/**
 * Shows delete options menu, back return to main menu
 * @param {*} taskController
 * @param {*} user
 */
async function deleteTasksMenu(taskController, user) {
  let tasksArray = [];
  tasksArray = await taskController.retrieveAll();
  const tasksByUser = getTasksByUser(tasksArray, user);
  if (tasksByUser.length != 0) {
    let exit = false;
    while (!exit) {
      let menu = getTaskTitlesMenu(tasksByUser, "Select a task to delete:");
      const menuOption = await inquirer.prompt([menu]);
      if (menuOption.menu === "Back") {
        exit = true;
      } else {
        let taskToDelete = tasksByUser[menuOption.menu.charAt(0) - 1];
        tasksByUser = await deleteTask(
          taskToDelete,
          taskController,
          tasksByUser
        );
        if (tasksByUser.length === 0) {
          console.log("There are no more tasks to delete");
          exit = true;
        }
      }
    }
  } else {
    console.log("There are no tasks to delete");
  }
}

/**
 * Shows a menu listing task's different status, back returns to main menu
 * @param {*} taskController
 * @param {*} user
 */
async function listTaskMenu(taskController, user) {
  let exit = false;
  let tasksArray = [];
  while (!exit) {
    const menuOption = await inquirer.prompt([taskMenu]);
    switch (menuOption.menu) {
      case "Pending":
        tasksArray = await taskController.getPendingTasks();
        await showTasksByStatus(taskController, user, tasksArray);
        break;
      case "Started":
        tasksArray = await taskController.getStartedTasks();
        await showTasksByStatus(taskController, user, tasksArray);
        break;
      case "Finished":
        tasksArray = await taskController.getFinishedTasks();
        await showTasksByStatus(taskController, user, tasksArray);
        break;
      case "Back":
        exit = true;
        break;
      default:
        console.log("What did you select?");
    }
  }
}

/**
 * Creates a new task with a title and details set as pending by default
 * @param {*} taskController
 * @param {*} user
 */
async function createNewTask(taskController, user) {
  const taskTitle = await inquirer.prompt([askTitle]);
  const taskDetails = await inquirer.prompt([askDetails]);
  const ca = await inquirer.prompt([confirmAction]);

  if (ca.confirm) {
    await taskController.create(
      new Task(
        null,
        taskTitle.title,
        taskDetails.details,
        "pending",
        new Date().toISOString(),
        null,
        null,
        user
      )
    );
    console.log("Task created");
  } else {
    console.log("Cancelled task creation");
  }
}

/**
 * Shows all tasks with specific status, back returns to task menu
 * @param {*} taskController
 * @param {*} user
 * @param {String} status
 */
async function showTasksByStatus(taskController, user, arrayByStatus) {
  let exit = false;
  const tasksByUser = getTasksByUser(arrayByStatus, user);
  if (tasksByUser.length != 0) {
    const menu = getTaskTitlesMenu(
      tasksByUser,
      "Select a task to view more details:"
    );
    while (!exit) {
      const menuOption = await inquirer.prompt([menu]);
      if (menuOption.menu === "Back") {
        exit = true;
      } else {
        let taskChosen = tasksByUser[menuOption.menu.charAt(0) - 1];
        await taskOptions(
          taskChosen,
          taskController,
          tasksArray,
          taskChosen.status
        );
        exit = true;
      }
    }
  } else {
    console.log(`You have no ${status} tasks`);
  }
}

/**
 * Shows options for selected task, back returns to list of selected status tasks menu
 * @param {Object} taskChosen
 * @param {*} taskController
 * @param {Array} tasksArray
 * @param {String} status
 */
async function taskOptions(taskChosen, taskController, tasksArray, status) {
  let exit = false;
  let newMenu = await createMenuFromStatus(status);
  while (!exit) {
    console.log(`Task chosen: ${taskChosen.title}`);
    const menuOption = await inquirer.prompt([newMenu]);
    switch (menuOption.menu) {
      case "View details":
        console.log(taskChosen); //Must clean up and improve (Laura)
        break;
      case "Set as pending":
        await updateTask(taskController, taskChosen, "pending", tasksArray);
        exit = true;
        break;
      case "Set as started":
        await updateTask(taskController, taskChosen, "started", tasksArray);
        exit = true;
        break;
      case "Set as finished":
        await updateTask(taskController, taskChosen, "finished", tasksArray);
        exit = true;
        break;
      case "Delete task":
        tasksArray = await deleteTask(taskChosen, taskController, tasksArray);
        exit = true;
        break;
      case "Back":
        exit = true;
        break;
      default:
        console.log("What did you select?");
    }
  }
}

/**
 * Updates a task to the specified status
 * @param {*} taskController
 * @param {Object} taskToUpdate
 * @param {String} status
 * @param {Array} taskList
 */
async function updateTask(taskController, taskToUpdate, status, taskList) {
  taskToUpdate.setStatus(status);
  if (status === "started") {
    taskToUpdate.setStartedAt(new Date().toISOString());
  } else if (status === "finished") {
    taskToUpdate.setFinishedAt(new Date().toISOString());
  }
  await taskController.update(taskToUpdate);
  console.log(`Task set as ${status}`);
  taskList.splice(taskList.indexOf(taskToUpdate), 1);
}

/**
 * Creates a new menu withouth the specified status
 * @param {String} status
 * @returns {Object}
 */
async function createMenuFromStatus(status) {
  let choiceStatus = `Set as ${status}`;
  detailsMenu.choices = [
    "View details",
    "Set as pending",
    "Set as started",
    "Set as finished",
    "Delete task",
    "Back",
  ];
  let newMenu = detailsMenu;
  for (let i = 0; i < newMenu.choices.length; i++) {
    if (newMenu.choices[i] === choiceStatus) {
      newMenu.choices.splice(i, 1);
    }
  }
  return newMenu;
}

/**
 * Filter tasks by user
 * @param {Array} tasksArray
 * @param {*} user
 * @returns {Array}
 */
function getTasksByUser(tasksArray, user) {
  return tasksArray.filter((task) => task.createdBy === user);
}

/**
 * Get task titles menu
 * @param {Array} tasks
 * @param {String} message
 * @returns {Object}
 */
function getTaskTitlesMenu(tasks, message) {
  const choices = tasks.map((task, index) => `${index + 1}. ${task.title}`);
  choices.push("Back");

  const menu = {
    type: "list",
    name: "menu",
    message: message,
    choices: choices,
  };

  return menu;
}

module.exports = initProgram;
