# Questions CLI

CLI Questions, is a CLI made to communicate with a API Questions. 
Project for the college subject, Software Engineering.

### Installation

**Install Node.**
- Install NVM
  - Windows users: https://github.com/coreybutler/nvm-windows
  - Linux/OSX users: https://github.com/creationix/nvm 
- Install Node 8.4.0
  - nvm install 8.4.0
  - nvm use 8.4.0

**Install Question-CLI.**

```sh
npm install --global questions-cli
```

### Usage
  Usage: questions-cli [options] [command]

  A CLI to communicate with the Questions API


  Options:

    -V, --version  output the version number
    -h, --help     output usage information


  Commands:

    create|c       Creates a question
    get|g <id>     Fetchs a question by it's ID
    getAll|ga      Fetchs questions
    update|u <id>  Updates the question with the given ID
    delete|d <id>  Deletes the question with the given ID

