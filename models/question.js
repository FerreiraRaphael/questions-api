/**
 * @module models/question
 * @file Question Sequelize Model definition.
 */

module.exports = (sequelize, DataTypes) => {
  const Question = sequelize.define(
    'Question',
    {
      description: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
          min: 10
        }
      },
      type: {
        type: DataTypes.ENUM('dissertative', 'objective'),
        allowNull: false
      },
      keyWords: {
        type: DataTypes.JSON,
        validate: {
          correctSum(value) {
            if (!value) return;
            const keyWordsValue = Object.keys(value).reduce(
              (sum, nextKey) => sum + value[nextKey],
              0
            );
            if (keyWordsValue !== 1) {
              throw new Error('The sum of the Key words value, must be 1.');
            }
          },
          correctKeyWordValue(value) {
            if (!value) return;
            const keyWordsValue = Object.keys(value).map(key => value[key]);
            if (keyWordsValue.indexOf(0) !== -1) {
              throw new Error('Key words must have a value greater than 0');
            }
          }
        }
      },
      alternatives: {
        type: DataTypes.JSON,
        validate: {
          haveCorrectAnswer(value) {
            if (!value) return;
            const correctAnswer = Object.keys(value)
              .map(alternative => value[alternative])
              .filter(alternativeValue => alternativeValue);
            if (correctAnswer.length !== 1) {
              throw new Error('There must one correct Alternative.');
            }
          }
        }
      }
    },
    {
      validate: {
        dissertativeQuestionMustHaveKeyWords() {
          if (this.type === 'dissertative' && !this.keyWords) {
            throw new Error(
              'Questions of type dissertative must have key words.'
            );
          }
        },
        objetiveQuestionMustHaveAlternatives() {
          if (this.type === 'objective' && !this.alternatives) {
            throw new Error(
              'Questions of type objective must have alternatives.'
            );
          }
        }
      }
    }
  );

  return Question;
};
