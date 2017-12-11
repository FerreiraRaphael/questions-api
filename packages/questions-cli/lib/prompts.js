function createPrompts() {
  return [
    {
      type: 'input',
      name: 'description',
      message: 'Insert a description',
      validate(answer) {
        if (!answer.length) return 'Insert a valid description';
        return true;
      }
    },
    {
      type: 'list',
      name: 'type',
      message: 'Choose a Question type',
      choices: ['Dissertative', 'Objective'],
      filter: answer => answer.toLowerCase()
    },
    {
      type: 'Input',
      name: 'keyWords',
      message: `Insert Key Words,
        Example: "Key Word: Software Engineering; Value: 0.5 ..
                  Key Word: SWEBOK; Value: 0.5"
      `,
      when(answers) {
        return answers.type === 'dissertative';
      },
      validate(answer) {
        const keyWords = Object.keys(answer);
        if (!keyWords.length) return 'Insert at least one valid Key word';
        const errors = keyWords.reduce(
          (result, key) =>
            Number.isNaN(answer[key])
              ? `${result}
                Key Word: ${key}, has a invalid Value`
              : result,
          ''
        );
        return errors || true;
      },
      filter(answer) {
        return JSON.stringify(
          answer.split(' ..').reduce((result, next) => {
            const values = next.split(';');
            if (values.length !== 2) return result;
            return {
              ...result,
              [values[0].replace('Key Word:', '').trim()]: Number(
                values[1].replace('Value:', '').trim()
              )
            };
          }, {})
        );
      }
    },
    {
      type: 'Input',
      name: 'alternatives',
      message: `Insert Alternatives,
        Example: "Alternative: Alternative One; Value: true ..
                  Alternative: Alternative Two; Value: false"
      `,
      when(answers) {
        return answers.type === 'objective';
      },
      validate(answer) {
        const keyWords = Object.keys(JSON.parse(answer));
        if (!keyWords.length) return 'Insert at least one valid Alternative';
        return true;
      },
      filter(answer) {
        return JSON.stringify(
          answer.split(' ..').reduce((result, next) => {
            const values = next.split(';');
            if (values.length !== 2) return result;
            return {
              ...result,
              [values[0].replace('Alternative:', '').trim()]:
                values[1].replace('Value:', '').trim() === 'true'
            };
          }, {})
        );
      }
    }
  ];
}

function updatePrompts(question) {
  return [
    {
      type: 'checkbox',
      name: 'fields',
      message: 'Which field do you want to update ?',
      choices: [
        { name: 'Description' },
        {
          name: `Type, change to ${
            question.type === 'dissertative' ? 'Objective' : 'Dissertative'
          } ?`
        },
        { name: 'Key Words', disabled: question.type !== 'dissertative' },
        { name: 'Alternatives', disabled: question.type !== 'objective' }
      ],
      validate(answers) {
        if (answers.length === 0) {
          return 'Select one field';
        }
        if (
          answers.indexOf('Type') !== -1 &&
          (answers.indexOf('Key Words') !== -1 ||
            answers.indexOf('Alternatives') !== -1)
        ) {
          return `Change change Type and ${
            question.type === 'dissertative' ? 'Key Words' : 'Alternatives'
          } at the same time`;
        }
        return true;
      }
    },
    {
      type: 'Input',
      name: 'description',
      message: 'Insert a description',
      when(answers) {
        return answers.fields.indexOf('Description') !== -1;
      }
    },
    {
      type: 'Input',
      name: 'keyWords',
      message: `Insert Key Words,
        Example: "Key Word: Software Engineering; Value: 0.5 ..
                  Key Word: SWEBOK; Value: 0.5"
      `,
      when(answers) {
        const questionIsChangingToDissertative =
          question.type === 'objective' &&
          answers.fields.indexOf('Type, change to Dissertative ?') !== -1;
        return (
          answers.fields.indexOf('Key Words') !== -1 ||
          questionIsChangingToDissertative
        );
      },
      validate(answer) {
        const keyWords = Object.keys(answer);
        if (!keyWords.length) return 'Insert at least one valid Key word';
        const errors = keyWords.reduce(
          (result, key) =>
            Number.isNaN(answer[key])
              ? `${result}
                Key Word: ${key}, has a invalid Value`
              : result,
          ''
        );
        return errors || true;
      },
      filter(answer) {
        return JSON.stringify(
          answer.split(' ..').reduce((result, next) => {
            const values = next.split(';');
            if (values.length !== 2) return result;
            return {
              ...result,
              [values[0].replace('Key Word:', '').trim()]: Number(
                values[1].replace('Value:', '').trim()
              )
            };
          }, {})
        );
      }
    },
    {
      type: 'Input',
      name: 'alternatives',
      message: `Insert Alternatives,
        Example: "Alternative: Alternative One; Value: true ..
                  Alternative: Alternative Two; Value: false"
      `,
      when(answers) {
        const questionIsChangingToObjective =
          question.type === 'dissertative' &&
          answers.fields.indexOf('Type, change to Objective ?') !== -1;
        return (
          answers.fields.indexOf('Alternative') !== -1 ||
          questionIsChangingToObjective
        );
      },
      validate(answer) {
        const keyWords = Object.keys(JSON.parse(answer));
        if (!keyWords.length) return 'Insert at least one valid Alternative';
        return true;
      },
      filter(answer) {
        return JSON.stringify(
          answer.split(' ..').reduce((result, next) => {
            const values = next.split(';');
            if (values.length !== 2) return result;
            return {
              ...result,
              [values[0].replace('Alternative:', '').trim()]:
                values[1].replace('Value:', '').trim() === 'true'
            };
          }, {})
        );
      }
    }
  ];
}

module.exports = {
  createPrompts,
  updatePrompts
};
