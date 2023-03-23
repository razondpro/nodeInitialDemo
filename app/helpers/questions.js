const dbSelection = {
    type: 'list',
    name: 'dbType',
    message: 'What database do you want to use?',
    choices: [
      'Json',
      'Mongo',
      'Mysql',
    ],
}

const askName ={
    type: 'input',
    name: 'name',
    message: `What's your  name`,
}

const mainMenu = {
    type: 'list',
    name: 'menu',
    message: 'What do you want to do?',
    choices: [
      'Create a new task',
      'Show tasks',
      'Delete tasks',
      'Exit'
    ],
    loop: true
}

const askTitle = {
  type: 'input',
  name: 'title',
  message: 'Please write a title for your new task',
}

const askDetails = {
  type: 'input',
  name: 'details',
  message: 'Please provide the details of the task',
}

const confirmAction = {
  type: 'confirm',
  name: 'confirm',
  message: 'Are you sure?',
}

module.exports = {
    dbSelection,
    askName,
    mainMenu,
    askTitle,
    askDetails,
    confirmAction
}