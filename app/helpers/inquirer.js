const inquirer = require('inquirer');
const TaskController = require('../tasks/controller')
const TaskRepositoryFactory = require('../tasks/repositories/task.repository.factory')
const Task = require('../tasks/task')


const {
    dbSelection,
    askName,
    mainMenu,
    showMenu,
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
        const secondAnswer = await inquirer.prompt([mainMenu]);
        switch (secondAnswer.menu) {
            case 'Create a new task':
                await createNewTask(tc, user);
                break;
            case 'Show tasks':
                await listShowMenu();
                break;
            case 'Delete tasks':
                console.log('Delete tasks');
                break;
            case 'Exit':
                exit = true;
                break
            default:
                console.log('What did you selected?');
        }
    }
}

async function listShowMenu() {
    let exit = false;
    while (!exit) {
        const secondAnswer = await inquirer.prompt([showMenu]);
        switch (secondAnswer.menu) {
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
                console.log("Back to the menu (which was already up)");
                break;
            default:
                console.log('What did you selected?');
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


module.exports = initProgram