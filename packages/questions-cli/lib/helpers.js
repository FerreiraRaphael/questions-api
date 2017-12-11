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
