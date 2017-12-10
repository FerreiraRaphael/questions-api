const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const passport = require('passport');

const { StrategyBearer } = require('./lib/passport-strategies');
const { withApiError } = require('./lib/helpers');
const routes = require('./routes/index');

const app = express();

passport.use(StrategyBearer);

if (process.env.NODE_ENV !== 'test') {
  app.use(logger('dev'));
}
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/v1', routes);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
// no stacktraces leaked to user unless in development environment
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  withApiError({
    description: err.message || 'Internal Server Error',
    status: err.status || 500
  })(res);
});

module.exports = app;
