const dbSelection = {
    type: 'list',
    name: 'dbType',
    message: 'What database do you want to use?',
    choices: ['Json', 'Mongo', 'Mysql',]
}

const askName = {
    type: 'input',
    name: 'name',
    message: `What's your  name`
}

const mainMenu = {
    type: 'list',
    name: 'menu',
    message: `(Main menu)
    What do you want to do?`,
    choices: [
        'Create a new task', 'Show tasks', 'Delete tasks', 'Exit'
    ],
    loop: true
}

const taskMenu = {
    type: 'list',
    name: 'menu',
    message: `(Task menu)
    What type of task do you want to see?`,
    choices: [
        'Pending', 'Started', 'Finished', 'Back'
    ],
    loop: true
}

const pendingTasks = {
    type: 'list',
    name: 'menu',
    message: `(Pending tasks)
    Select the task you want to view`,
    choices: [
    ],
    loop: true
}

const askTitle = {
    type: 'input',
    name: 'title',
    message: 'Please write a title for your new task'
}

const askDetails = {
    type: 'input',
    name: 'details',
    message: 'Please provide the details of the task'
}

const confirmAction = {
    type: 'confirm',
    name: 'confirm',
    message: 'Are you sure?'
}

module.exports = {
    dbSelection,
    askName,
    mainMenu,
    taskMenu,
    pendingTasks,
    askTitle,
    askDetails,
    confirmAction
}
