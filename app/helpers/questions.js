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

const detailsMenu = {
    type: 'list',
    name: 'menu',
    message: `(Details menu)
    What do you want to do with the current task?`,
    choices: [
        'View details', 'Set as pending', 'Set as started', 'Set as finished', 'Delete task', 'Back'
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
    detailsMenu,
    askTitle,
    askDetails,
    confirmAction
}
