const axios = require('axios');
const chalk = require('chalk');
const ora = require('ora');

const API_URL =
  process.env.QUESTIONS_CLI_API_URL || 'https://api-questions.herokuapp.com';

/**
 * Creates a dissertative question.
 * @function createDissertativeQuestion
 * @param  {string} description Question Description
 * @param  {string} type Question Type
 * @param  {object} keyWords Question Key words Object
 * @return {object} Axios response
 */
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

/**
 * Creates a objective Question.
 * @function createObjectiveQuestion
 * @param  {string} description Question Description
 * @param  {string} type Question Type
 * @param  {object} alternatives Question Alternatives Object
 * @return {object} Axios response
 */
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

/**
 * Fetchs all question by the given Type, or all questions if Type is not given.
 * @function fetchQuestions
 * @param  {string} type Question Type
 * @return {object} Axios response
 */
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

/**
 * Fetch a Question by the given ID.
 * @function fetchQuestion
 * @param  {string} id Question ID.
 * @return {object} Axios response
 */
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

/**
 * Update a Question by the given ID and fields to update.
 * @function updateQuestion
 * @param {string} id Question ID.
 * @param {object} fields Fields to update.
 * @return {object} Axios response
 */
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

/**
 * Delete a Question by the given ID.
 * @function deleteQuestion
 * @param {string} id Question ID.
 * @return {object} Axios response
 */
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
