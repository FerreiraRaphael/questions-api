/**
 * @module routes/index
 * @file /api/v1/ routes
 */

const express = require('express');
const questionRoutes = require('./question');

const router = express.Router();
router.use('/question', questionRoutes);

module.exports = router;
