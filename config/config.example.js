module.exports = {
  development: {
    username: 'postgres',
    password: '',
    database: 'questions_development',
    host: '127.0.0.1',
    dialect: 'postgres'
  },
  test: {
    username: 'postgres',
    password: '',
    database: 'questions_test',
    host: '127.0.0.1',
    dialect: 'postgres',
    logging: false
  },
  production: {
    username: 'postgres',
    password: '',
    database: 'questions_production',
    host: '127.0.0.1',
    dialect: 'postgres'
  }
};
