const inquirer = require('inquirer');
const TaskController = require('../tasks/controller')
const TaskRepositoryFactory = require('../tasks/repositories/task.repository.factory')
const Task = require('../tasks/task')


const {
    dbSelection,
    askName,
    mainMenu,
    taskMenu,
    askTitle,
    askDetails,
    confirmAction
} = require('./questions')

/**
 * Initialization of main program
 */
async function initProgram(){

    const db = await inquirer.prompt([dbSelection])
    const dbType = db.dbType.toLowerCase();

    await listMainMenu(dbType);

    process.exit(0)
}

/**
 * Lists main menu in terminal
 * @param {String} dbType 
 */
async function listMainMenu(dbType) {
    const tc = new TaskController(TaskRepositoryFactory.create(dbType))
    const user = await inquirer.prompt([askName])

    let exit = false;
    while (!exit) {
        const menuOption = await inquirer.prompt([mainMenu]);
        switch (menuOption.menu) {
            case 'Create a new task':
                await createNewTask(tc, user);
                break;
            case 'Show tasks':
                await listTaskMenu();
                break;
            case 'Delete tasks':
                console.log('Delete tasks');
                break;
            case 'Exit':
                exit = true;
                break
            default:
                console.log('What did you select?');
        }
    }
}

async function listTaskMenu() {
    let exit = false;
    while (!exit) {
        const menuOption = await inquirer.prompt([taskMenu]);
        switch (menuOption.menu) {
            case 'Pending':
                //To-do
                break;
            case 'Started':
                //To-do
                break;
            case 'Finished':
                //To-do
                break;
            case 'Back':
                exit = true;
                break;
            default:
                console.log('What did you select?');
        }
    }
}

async function createNewTask(taskController, user) {
    const taskTitle = await inquirer.prompt([askTitle])
    const taskDetails = await inquirer.prompt([askDetails])
    const ca = await inquirer.prompt([confirmAction])

    if(ca.confirm){
        await taskController.create(new Task(null, taskTitle.title, taskDetails.details, 'pending', new Date().toISOString(), null, null, user.name))
        console.log('Task created')
    }else {
        console.log('Cancelled task creation')
    }
}


//show all started tasks:
async function showStartedTasks(taskController, user) {
    let exit = false;
    const tasksArray = await taskController.getStartedTasks();
    const tasksByUser = getTasksByUser(tasksArray, user);

    while (!exit) {
        const menuOption = await inquirer.prompt([{
            type: 'list',
            name: 'menu',
            message: 'Select a task to view more details:',
            choices: [getTaskTitlesMenu, 'Back']
        }]);
        if(menuOption.menu === 'Back') {
            exit = true;
        } else {
            console.log(tasksByUser[(menuOption.menu.charAt(0) - 1)]);
        }
    }
}

function getTasksByUser(tasksArray, user) {
    return tasksArray.filter(task => task.createdBy === user.name);
}

function getTaskTitlesMenu(tasks) {
    return tasks.map((task, index) => `${index + 1}. ${task.title}`);
}








module.exports = initProgram