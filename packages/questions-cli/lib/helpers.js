/**
 * @typedef {Object} QuestionUpdateAnswerObject
 * @property {string} description Question description
 * @property {object} alternatives Question alternatives
 * @property {object} keyWords Question key words
 * @property {object} fields Selected fields for update
 */

/**
 * @function transformUserUpdateAnswer
 * @param  {QuestionUpdateAnswerObject} answers Object of user answers at Update Question Function
 * @return {{description: string, type: string, keyWords: object, alternatives: object}}
 * Question Update object for the API
 */
function transformUserUpdateAnswer(answers) {
  const { keyWords, description, alternatives, fields } = answers;

  return {
    ...(description ? { description } : {}),
    ...(fields.indexOf('Type, change to Objective ?') !== -1
      ? { type: 'objective' }
      : {}),
    ...(fields.indexOf('Type, change to Dissertative ?') !== -1
      ? { type: 'dissertative' }
      : {}),
    ...(keyWords ? { keyWords: JSON.parse(keyWords) } : {}),
    ...(alternatives ? { alternatives: JSON.parse(alternatives) } : {})
  };
}

module.exports = {
  transformUserUpdateAnswer
};
