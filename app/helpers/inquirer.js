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
    confirmAction,
    pendingTasks
} = require('./questions')

/**
 * Initialization of main program
 */
async function initProgram() {

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
                await listTaskMenu(tc);
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

async function listTaskMenu(tc) {
    let exit = false;
    while (!exit) {
        const menuOption = await inquirer.prompt([taskMenu]);
        switch (menuOption.menu) {
            case 'Pending':
                await showPendingTasks(tc);
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

    if (ca.confirm) {
        await taskController.create(new Task(null, taskTitle.title, taskDetails.details, 'pending', new Date().toISOString(), null, null, user.name))
        console.log('Task created')
    } else {
        console.log('Cancelled task creation')
    }
}

async function showPendingTasks(taskController) {
    let counter = 0;
    let exit = false;
    const tasksArray = await taskController.getPendingTasks();
    pendingTasks.choices = [];
        tasksArray.forEach(task => {
            counter++;
            let choiceTitle = `${counter}. ${task.title}`
            pendingTasks.choices.push(choiceTitle);
        })
    
    pendingTasks.choices.push('Back');
    while (!exit) {
        const menuOption = await inquirer.prompt([pendingTasks]);
        if(menuOption.menu === 'Back') {
            exit = true;
        }else {
        console.log(tasksArray[(menuOption.menu.charAt(0) - 1)]);
        }
    }
}


module.exports = initProgram