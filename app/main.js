const inquirer = require("inquirer");
var Colors = require('colors/safe');
const db = require('./config/db')
const TaskController = require("./tasks/controller");
const TaskRepositoryFactory = require("./tasks/repositories/task.repository.factory");
const Task = require("./tasks/task");

const {
  dbSelection,
  askName,
  mainMenu,
  taskMenu,
  detailsMenu,
  askTitle,
  askDetails,
  confirmAction,
} = require("./helpers/questions");


let dbType;
let user;
let taskController;
(async () => {
  dbType = await askForDB();
  user = await askForUser();
  taskController = new TaskController(TaskRepositoryFactory.create(dbType));
  //runs program in a loop
  await listMainMenu();
})()



/**
 * Asks in a prompt for db selection
 * @returns db selected
 */
async function askForDB() {
  const db = await inquirer.prompt([dbSelection]);
  return db.dbType.toLowerCase();
}
/**
 * Asks for user name
 * @returns user name
 */
async function askForUser() {
  const answer = await inquirer.prompt([askName]);
  return answer.name;
}

/**
 * Lists main menu in terminal in a loop
 */
async function listMainMenu() {
  let exit = false;
  while (!exit) {
    const menuOption = await inquirer.prompt([mainMenu]);
    switch (menuOption.menu) {
      case "Create a new task":
        await createNewTask();
        break;
      case "Show tasks":
        await listTaskMenu();
        break;
      case "Delete tasks":
        await deleteTasksMenu();
        break;
      case "Exit":
        exit = true;
        break;
      default:
        console.log(Colors.red("What did you select?"));
    }
  }
  process.exit(0);
}
/**
 * Deletes specific task
 * @param {Object} taskToDelete
 * @param {Number} positionInArray
 * @param {Array} taskList
 */
async function deleteTask(taskToDelete, positionInArray, taskList) {
  const ca = await inquirer.prompt([confirmAction]);
  if (ca.confirm) {
    await taskController.delete(taskToDelete.id);
    taskList.splice(positionInArray, 1);
    console.log(Colors.green("Succesfully deleted"));
  }
  return taskList;
}

/**
 * Shows delete options menu, back return to main menu
 */
async function deleteTasksMenu() {
  let tasksArray = [];
  tasksArray = await taskController.retrieveAll();
  let tasksByUser = getTasksByUser(tasksArray);
  if (tasksByUser.length != 0) {
    let exit = false;
    while (!exit) {
      let menu = getTaskTitlesMenu(tasksByUser, "Select a task to delete:");
      const menuOption = await inquirer.prompt([menu]);
      if (menuOption.menu === "Back") {
        exit = true;
      } else {
        const position = menuOption.menu.charAt(0) - 1;
        const taskToDelete = tasksByUser[position];
        tasksByUser = await deleteTask(
          taskToDelete,
          position,
          [...tasksByUser]
        );
        if (tasksByUser.length === 0) {
          console.log(Colors.red("There are no more tasks to delete"));
          exit = true;
        }
      }
    }
  } else {
    console.log(Colors.red("There are no tasks to delete"));
  }
}

/**
 * Shows a menu listing task's different status, back returns to main menu
 */
async function listTaskMenu() {
  let exit = false;
  let tasksArray = [];
  while (!exit) {
    const menuOption = await inquirer.prompt([taskMenu]);
    switch (menuOption.menu) {
      case "Pending":
        tasksArray = await taskController.getPendingTasks();
        await showTasksByStatus(tasksArray);
        break;
      case "Started":
        tasksArray = await taskController.getStartedTasks();
        await showTasksByStatus(tasksArray);
        break;
      case "Finished":
        tasksArray = await taskController.getFinishedTasks();
        await showTasksByStatus(tasksArray);
        break;
      case "Back":
        exit = true;
        break;
      default:
        console.log(Colors.red("What did you select?"));
    }
  }
}

/**
 * Creates a new task with a title and details set as pending by default
 */
async function createNewTask() {
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
        new Date(Date.now()).toISOString(),
        null,
        null,
        user
      )
    );
    console.log(Colors.green("Task created"));
  } else {
    console.log(Colors.red("Cancelled task creation"));
  }
}

/**
 * Shows all tasks with specific status, back returns to task menu
 * @param {String} status
 */
async function showTasksByStatus(arrayByStatus) {
  let exit = false;
  const tasksByUser = getTasksByUser(arrayByStatus);
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
        const position = menuOption.menu.charAt(0) - 1
        let taskChosen = tasksByUser[position];
        await taskOptions(
          taskChosen,
          position,
          arrayByStatus,
          taskChosen.status
        );
        exit = true;
      }
    }
  } else {
    console.log(Colors.red(`You have no tasks`));
  }
}

/**
 * Shows options for selected task, back returns to list of selected status tasks menu
 * @param {Object} taskChosen
 * @param {*} position
 * @param {Array} tasksArray
 * @param {String} status
 */
async function taskOptions(taskChosen, position, tasksArray, status) {
  let exit = false;
  let newMenu = await createMenuFromStatus(status);
  while (!exit) {
    console.log(Colors.brightGreen(`Task chosen: ${taskChosen.title}`));
    const menuOption = await inquirer.prompt([newMenu]);
    switch (menuOption.menu) {
      case "View details":
        console.log(taskChosen); //Must clean up and improve (Laura)
        break;
      case "Set as pending":
        await updateTask(taskChosen, "pending", tasksArray);
        exit = true;
        break;
      case "Set as started":
        await updateTask(taskChosen, "started", tasksArray);
        exit = true;
        break;
      case "Set as finished":
        await updateTask(taskChosen, "finished", tasksArray);
        exit = true;
        break;
      case "Delete task":
        tasksArray = await deleteTask(taskChosen, position, [...tasksArray]);
        exit = true;
        break;
      case "Back":
        exit = true;
        break;
      default:
        console.log(Colors.red("What did you select?"));
    }
  }
}

/**
 * Updates a task to the specified status
 * @param {Object} taskToUpdate
 * @param {String} status
 * @param {Array} taskList
 */
async function updateTask(taskToUpdate, status, taskList) {
  taskToUpdate.setStatus(status);
  if (status === "started") {
    taskToUpdate.setStartedAt(new Date(Date.now()).toISOString());
  } else if (status === "finished") {
    taskToUpdate.setFinishedAt(new Date(Date.now()).toISOString());
  }
  await taskController.update(taskToUpdate);
  console.log(Colors.green(`Task set as ${status}`));
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
 * @returns {Array}
 */
function getTasksByUser(tasksArray) {
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
