const axios = require('axios');
const chalk = require('chalk');
const ora = require('ora');

const DEFAULT_API_URL =
  process.env.NODE_ENV !== 'production'
    ? 'http://localhost:3001'
    : 'https://questions.herokuapp.com';

const API_URL = process.env.QUESTIONS_CLI_API_URL || DEFAULT_API_URL;

async function createDissertativeQuestion({ description, type, keyWords }) {
  const spinner = ora('Creating Dissertative Question.').start();
  try {
    const response = await axios.post(`${API_URL}/api/v1/question`, {
      description,
      type,
      keyWords
    });
    spinner.succeed();
    console.info(chalk.green(response.data.description));
    console.info(response.data.body);
    return response;
  } catch (e) {
    spinner.fail();
    console.info(chalk.red(e.response ? e.response.data.description : e));
    return e;
  }
}

async function createObjectiveQuestion({ description, type, alternatives }) {
  const spinner = ora('Creating Objective Question.').start();
  try {
    const response = await axios.post(`${API_URL}/api/v1/question`, {
      description,
      type,
      alternatives
    });
    spinner.succeed();
    console.info(chalk.green(response.data.description));
    console.info(response.data.body);
    return response;
  } catch (e) {
    spinner.fail();
    console.info(chalk.red(e.response ? e.response.data.description : e));
    return e;
  }
}

async function fetchQuestions(type) {
  const spinner = ora('Fetching Questions.').start();
  try {
    const response = await axios.get(`${API_URL}/api/v1/question`, {
      params: type ? { type } : {}
    });
    spinner.succeed();
    console.info(chalk.green(response.data.description));
    console.info(response.data.body);
    return response;
  } catch (e) {
    spinner.fail();
    console.info(chalk.red(e.response ? e.response.data.description : e));
    return e;
  }
}

async function fetchQuestion(id) {
  const spinner = ora(`Fetching Question ${id}.`).start();
  try {
    const response = await axios.get(`${API_URL}/api/v1/question/${id}`);
    spinner.succeed();
    console.info(chalk.green(response.data.description));
    console.info(response.data.body);
    return response;
  } catch (e) {
    spinner.fail();
    console.info(chalk.red(e.response ? e.response.data.description : e));
    return e;
  }
}

async function updateQuestion(id, fields) {
  const spinner = ora(`Updating Question ${id}.`).start();
  try {
    const response = await axios.put(
      `${API_URL}/api/v1/question/${id}`,
      fields
    );
    spinner.succeed();
    console.info(chalk.green(response.data.description));
    console.info(response.data.body);
    return response;
  } catch (e) {
    spinner.fail();
    console.info(chalk.red(e.response ? e.response.data.description : e));
    return e;
  }
}

async function deleteQuestion(id) {
  const spinner = ora(`Deleting Question ${id}.`).start();
  try {
    const response = await axios.delete(`${API_URL}/api/v1/question/${id}`);
    spinner.succeed();
    console.info(chalk.green(response.data.description));
    return response;
  } catch (e) {
    spinner.fail();
    console.info(chalk.red(e.response ? e.response.data.description : e));
    return e;
  }
}

module.exports = {
  createDissertativeQuestion,
  createObjectiveQuestion,
  fetchQuestions,
  fetchQuestion,
  updateQuestion,
  deleteQuestion
};
