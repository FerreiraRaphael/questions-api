#! /usr/bin/env node

const program = require('commander');
const chalk = require('chalk');
const { prompt } = require('inquirer');

const {
  createDissertativeQuestion,
  createObjectiveQuestion,
  fetchQuestions,
  fetchQuestion,
  updateQuestion,
  deleteQuestion
} = require('./lib/requests');

const { transformUserUpdateAnswer } = require('./lib/helpers');

const { createPrompts, updatePrompts } = require('./lib/prompts');

program
  .version('1.0.4')
  .description('A CLI to communicate with the Questions API');

program
  .command('create')
  .alias('c')
  .description('Creates a question')
  .action(async () => {
    const userAnswers = await prompt(createPrompts());
    const { keyWords, description, alternatives, type } = userAnswers;
    if (type === 'dissertative') {
      await createDissertativeQuestion({
        description,
        type,
        keyWords: JSON.parse(keyWords)
      });
    } else {
      await createObjectiveQuestion({
        description,
        type,
        alternatives: JSON.parse(alternatives)
      });
    }
  });

program
  .command('get <id>')
  .alias('g')
  .description("Fetchs a question by it's ID")
  .action(async id => {
    if (id.commands) {
      console.info(chalk.yellow('Please, insert a Id'));
    } else {
      await fetchQuestion(id);
    }
  });

program
  .command('getAll')
  .alias('ga')
  .description('Fetchs questions')
  .action(async () => {
    const { type } = await prompt([
      {
        type: 'list',
        name: 'type',
        message: 'What kind of Questions do you want to fetch ?',
        choices: ['All', 'Dissertative', 'Objective'],
        default: 'All',
        filter: value => value.toLowerCase()
      }
    ]);
    await fetchQuestions(type === 'all' ? '' : type);
  });

program
  .command('update <id>')
  .alias('u')
  .description('Updates the question with the given ID')
  .action(async id => {
    // Id not insert
    if (id.commands) {
      console.info(chalk.yellow('Please, insert a Id'));
    } else {
      const response = await fetchQuestion(id);
      const question = response.data.body;
      const userAnswers = await prompt(updatePrompts(question));

      await updateQuestion(id, transformUserUpdateAnswer(userAnswers));
    }
  });

program
  .command('delete <id>')
  .alias('d')
  .description('Deletes the question with the given ID')
  .action(async id => {
    if (id.commands) {
      console.info(chalk.yellow('Please, insert a Id'));
    } else {
      await deleteQuestion(id);
    }
  });

program.parse(process.argv);
