/**
 * @module lib/passport-strategies
 * @file Exports passport strategies, for authentication.
 */

const BearerStrategy = require('passport-http-bearer');
const jwt = require('jsonwebtoken');

/**
 * Bearer strategy, for authenticate the user with the Bearer token pattern.
 */
const StrategyBearer = new BearerStrategy(
  { passReqToCallback: true },
  async (req, token, done) => {
    try {
      const user = await jwt.verify(
        token,
        `${process.env.APP_SECRET || 'development'}`
      );
      if (!user) {
        return done(null, { error: 'Unknow error on auth' });
      }
      return done(null, user);
    } catch (e) {
      return done(null, { error: e.message });
    }
  }
);

module.exports = {
  StrategyBearer
};
