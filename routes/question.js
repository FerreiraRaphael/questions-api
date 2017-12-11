/**
 * @module routes/question
 * @file /api/v1/question routes
 */

const express = require('express');

const { withApiError, withApiResponse } = require('../lib/helpers');
const { Question } = require('../models');

const router = express.Router();

router
  .route('/')
  .get(
    /**
     * GET /api/v1/question
     * Fetch questions.
     * @function fetchQuestions
     * @param {Request} req Express Request.
     * @param {string} req.query.type Question type.
     * @param {Response} res Express Response.
     */
    async (req, res) => {
      try {
        const questions = await Question.findAll({ where: req.query });
        withApiResponse({
          description: `Questions fetched`,
          body: questions
        })(res);
      } catch (error) {
        withApiError({
          description: `Error while fetching Questions: ${error.message}`,
          error,
          code: 'routes.question.fetchQuestions'
        })(res);
      }
    }
  )
  .post(
    /**
     * POST /api/v1/question
     * Creates a question.
     * @function createQuestion
     * @param {Request} req Express Request.
     * @param {Object} req.body Request body.
     * @param {string} req.body.description Question description.
     * @param {('dissertative','objective')} req.body.type Question type, it can be
     * dissertative or objective.
     * @param {Object} req.body.keyWords The question key words and it's values.
     * @param {Object} req.body.alternatives The question alternatives and it's values.
     * @param {Response} res Express Response.
     */
    async (req, res) => {
      const { description, type, keyWords, alternatives } = req.body;
      try {
        const question = await Question.create({
          description,
          type,
          keyWords,
          alternatives
        });
        withApiResponse({
          description: `A New Question was created`,
          body: question
        })(res);
      } catch (error) {
        withApiError({
          description: `Error while creating Question: ${error.message}`,
          error,
          code: 'routes.question.createQuestion'
        })(res);
      }
    }
  );

router
  .route('/:QuestionId')
  .get(
    /**
     * GET /api/v1/question
     * Fetch a question.
     * @function fetchQuestion
     * @param {Request} req Express Request.
     * @param {string} req.params.QuestionId Question ID.
     * @param {Response} res Express Response.
     */
    async (req, res) => {
      try {
        const question = await Question.find({
          where: { id: req.params.QuestionId }
        });
        withApiResponse({
          description: `Question ${question.id} fetched`,
          body: question
        })(res);
      } catch (error) {
        withApiError({
          description: `Error while fetching Question: ${error.message}`,
          error,
          code: 'routes.question.fetchQuestion'
        })(res);
      }
    }
  )
  .put(
    /**
     * PUT /api/v1/question/:QuestionId
     * Updates a question.
     * @function updateQuestion
     * @param {Request} req Express Request.
     * @param {Object} req.body Request body.
     * @param {string} req.body.description Question description.
     * @param {('dissertative','objective')} req.body.type Question type, it can be
     * dissertative or objective.
     * @param {Object} req.body.keyWords The question key words and it's values.
     * @param {Object} req.body.alternatives The question alternatives and it's values.
     * @param {string} req.params.QuestionId The id of the question that is going to be updated.
     * @param {Response} res Express Response.
     */
    async (req, res) => {
      try {
        const question = await Question.update(req.body, {
          where: { id: req.params.QuestionId },
          plain: true,
          returning: true
        });
        withApiResponse({
          description: `A Question was updated`,
          body: question
        })(res);
      } catch (error) {
        withApiError({
          description: `Error while updating Question: ${error.message}`,
          error,
          code: 'routes.question.updateQuestion'
        })(res);
      }
    }
  )
  .delete(
    /**
     * DELETE /api/v1/question
     * Fetch questions.
     * @function fetchQuestions
     * @param {Request} req Express Request.
     * @param {string} req.params.QuestionId The id of the question that is going to be deleted.
     * @param {Response} res Express Response.
     */
    async (req, res) => {
      try {
        const result = await Question.destroy({
          where: { id: req.params.QuestionId },
          plain: true,
          returning: true
        });
        withApiResponse({
          description: `The question with ID ${
            req.params.QuestionId
          } was deleted`,
          body: result
        })(res);
      } catch (error) {
        withApiError({
          description: `Error while fetching Questions: ${error.message}`,
          error,
          code: 'routes.question.fetchQuestions'
        })(res);
      }
    }
  );

module.exports = router;
