const inquirer = require("inquirer");
const TaskController = require("../tasks/controller");
const TaskRepositoryFactory = require("../tasks/repositories/task.repository.factory");
const Task = require("../tasks/task");

const {
  dbSelection,
  askName,
  mainMenu,
  taskMenu,
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
  const user = answer.name

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
        await deleteTask(tc, user)
        break;
      case "Exit":
        exit = true;
        break;
      default:
        console.log("What did you select?");
    }
  }
}

async function deleteTask(taskController, user){
    const tasksArray = await taskController.retrieveAll()
    
    if(tasksArray.getTasks().length){
        const tasksByUser = getTasksByUser(tasksArray.getTasks(), user)
        await showDeleteTasksMenu(taskController, tasksByUser)
    }else{
        console.log('There are no tasks to delete')
    }
}

async function showDeleteTasksMenu(taskController, tasksByUser){
    let menu = getTaskTitlesMenu(tasksByUser, 'Select a task to delete:')
    let exit = false;

    while (!exit) {
        const menuOption = await inquirer.prompt([menu]);
        if (menuOption.menu === "Back") {
            exit = true;
        } else {
            const ca = await inquirer.prompt([confirmAction]);
            if (ca.confirm) {
                await taskController.delete((tasksByUser[menuOption.menu.charAt(0) - 1]).id)
                tasksByUser.splice((menuOption.menu.charAt(0) - 1), 1)
                menu = getTaskTitlesMenu(tasksByUser, 'Select a task to delete:')
                console.log('Succesfully deleted')
            }
        }
    }
}

async function listTaskMenu(taskController, user) {
  let exit = false;
  while (!exit) {
    const menuOption = await inquirer.prompt([taskMenu]);
    switch (menuOption.menu) {
      case "Pending":
        //To-do
        break;
      case "Started":
        await showStartedTasks(taskController, user);
        break;
      case "Finished":
        //To-do
        break;
      case "Back":
        exit = true;
        break;
      default:
        console.log("What did you select?");
    }
  }
}

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

//show all started tasks:
async function showStartedTasks(taskController, user) {
  let exit = false;
  let tasksArray = await taskController.getStartedTasks();
  let tasksByUser = getTasksByUser(tasksArray, user);
  const menu = getTaskTitlesMenu(
    tasksByUser,
    "Select a task to view more details or delete:"
    );

    while (!exit) {
        const menuOption = await inquirer.prompt([menu]);
        if (menuOption.menu === "Back") {
            exit = true;
        } else if (menuOption.menu === "Delete") {
            await deleteTask(taskController, user);
            tasksArray = await taskController.getStartedTasks();
            tasksByUser = getTasksByUser(tasksArray, user);
            menu.choices = getTaskTitlesMenu(tasksByUser, "Select a task to view more details or delete:").choices;
        } else {
            console.log(tasksByUser[menuOption.menu.charAt(0) - 1]);
        }
    }
}

//Filter tasks by user:
function getTasksByUser(tasksArray, user) {
  return tasksArray.filter((task) => task.createdBy === user);
}

//Get task titles menu:
function getTaskTitlesMenu(tasks, message) {
    const choices = tasks.map((task, index) => `${index + 1}. ${task.title}`);
    choices.push("Back");
    choices.push("Delete");

    const menu = {
        type: 'list',
        name: 'menu',
        message: message,
        choices: choices
        };

    return menu;
}

module.exports = initProgram;
