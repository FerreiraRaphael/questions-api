const Bluebird = require('bluebird');
const request = require('supertest');
const httpStatus = require('http-status');
const expect = require('expect.js');

const app = require('../app');
const models = require('../models');

const { Question } = models;

describe('Route /question', () => {
  const dataDissertative = {
    description: 'Description for a dissertative question',
    type: 'dissertative',
    keyWords: {
      'Key Word 1': 0.1,
      'Key Word 2': 0.2,
      'Key Word 3': 0.3,
      'Key Word 4': 0.4
    }
  };
  const dataObjective = {
    description: 'Description for a objective question',
    type: 'objective',
    alternatives: {
      'Alternative One': false,
      'Alternative Two': true,
      'Alternative Three': false,
      'Alternative Four': false
    }
  };
  before(() => models.sequelize.sync());
  beforeEach(() =>
    Bluebird.all([
      Question.destroy({
        where: {}
      })
    ])
  );

  describe('POST /question', () => {
    it('creates a dissertative Question', async () => {
      await request(app)
        .post('/api/v1/question')
        .set('Accept', /application\/json/)
        .send(dataDissertative)
        .expect(httpStatus.OK);
      expect(await Question.count()).to.be(1);
    });

    it('fails to creates a dissertative Question, without key words', async () => {
      await request(app)
        .post('/api/v1/question')
        .set('Accept', /application\/json/)
        .send({ ...dataDissertative, keyWords: {} })
        .expect(httpStatus.BAD_REQUEST);
      expect(await Question.count()).to.be(0);
    });

    it("fails to creates a dissertative Question, that key words values sum isn't 1", async () => {
      await request(app)
        .post('/api/v1/question')
        .set('Accept', /application\/json/)
        .send({
          ...dataDissertative,
          keyWords: {
            'Key Word 1': 0.1,
            'Key Word 2': 0.2,
            'Key Word 3': 0.3,
            'Key Word 4': 0.3
          }
        })
        .expect(httpStatus.BAD_REQUEST);
      expect(await Question.count()).to.be(0);
    });

    it('fails to creates a dissertative Question, that a key Words value is equal 0', async () => {
      await request(app)
        .post('/api/v1/question')
        .set('Accept', /application\/json/)
        .send({
          ...dataDissertative,
          keyWords: {
            'Key Word 1': 0.1,
            'Key Word 2': 0.2,
            'Key Word 3': 0.3,
            'Key Word 4': 0.4,
            'Key Word 5': 0
          }
        })
        .expect(httpStatus.BAD_REQUEST);
      expect(await Question.count()).to.be(0);
    });

    it('creates a objective Question', async () => {
      await request(app)
        .post('/api/v1/question')
        .set('Accept', /application\/json/)
        .send(dataObjective)
        .expect(httpStatus.OK);
      expect(await Question.count()).to.be(1);
    });

    it("fails to creates a objective Question, that doesn't has a correct alternatives", async () => {
      await request(app)
        .post('/api/v1/question')
        .set('Accept', /application\/json/)
        .send({
          ...dataObjective,
          alternatives: {
            'Alternative One': false,
            'Alternative Two': false,
            'Alternative Three': false,
            'Alternative Four': false
          }
        })
        .expect(httpStatus.BAD_REQUEST);
      expect(await Question.count()).to.be(0);
    });

    it('fails to creates a objective Question, that has more than one correct alternatives', async () => {
      await request(app)
        .post('/api/v1/question')
        .set('Accept', /application\/json/)
        .send({
          ...dataObjective,
          alternatives: {
            'Alternative One': true,
            'Alternative Two': true,
            'Alternative Three': false,
            'Alternative Four': false
          }
        })
        .expect(httpStatus.BAD_REQUEST);
      expect(await Question.count()).to.be(0);
    });
  });

  describe('GET /question', () => {
    beforeEach(async () => {
      await Question.create(dataDissertative);
      await Question.create(dataObjective);
    });
    it('fetchs all questions', async () => {
      const response = await request(app)
        .get('/api/v1/question')
        .set('Accept', /application\/json/)
        .send()
        .expect(httpStatus.OK);
      const { body } = response.body;
      expect(body.length).to.be(2);
    });
    it('fetchs all dissertative questions', async () => {
      const response = await request(app)
        .get('/api/v1/question?type=dissertative')
        .set('Accept', /application\/json/)
        .send()
        .expect(httpStatus.OK);
      const { body } = response.body;
      expect(body.length).to.be(1);
    });
    it('fetchs all objective questions', async () => {
      const response = await request(app)
        .get('/api/v1/question?type=objective')
        .set('Accept', /application\/json/)
        .send()
        .expect(httpStatus.OK);
      const { body } = response.body;
      expect(body.length).to.be(1);
    });
  });

  describe('PUT /question/:QuestionId', async () => {
    let dissertativeQuestion;
    let objectiveQuestion;
    beforeEach(async () => {
      dissertativeQuestion = await Question.create(dataDissertative);
      objectiveQuestion = await Question.create(dataObjective);
    });

    it('updates a objective question', async () => {
      const response = await request(app)
        .put(`/api/v1/question/${objectiveQuestion.id}`)
        .set('Accept', /application\/json/)
        .send({ description: 'Updated description' })
        .expect(httpStatus.OK);
      const { body } = response.body;
      expect(body[1].description).to.be('Updated description');
    });
    it('fails to update a objective question, that has two correct answers', async () => {
      await request(app)
        .put(`/api/v1/question/${objectiveQuestion.id}`)
        .set('Accept', /application\/json/)
        .send({
          alternatives: {
            'Alternative One': true,
            'Alternative Two': true,
            'Alternative Three': false,
            'Alternative Four': false
          }
        })
        .expect(httpStatus.BAD_REQUEST);
    });
    it('fails to update a objective question, without alternatives', async () => {
      await request(app)
        .put(`/api/v1/question/${objectiveQuestion.id}`)
        .set('Accept', /application\/json/)
        .send({
          alternatives: {}
        })
        .expect(httpStatus.BAD_REQUEST);
    });
    it('fails to update a objective question, with no correct answer', async () => {
      await request(app)
        .put(`/api/v1/question/${objectiveQuestion.id}`)
        .set('Accept', /application\/json/)
        .send({
          alternatives: {
            'Alternative One': false,
            'Alternative Two': false,
            'Alternative Three': false,
            'Alternative Four': false
          }
        })
        .expect(httpStatus.BAD_REQUEST);
    });
    it('updates a dissertative question', async () => {
      const response = await request(app)
        .put(`/api/v1/question/${dissertativeQuestion.id}`)
        .set('Accept', /application\/json/)
        .send({ description: 'Updated description' })
        .expect(httpStatus.OK);
      const { body } = response.body;
      expect(body[1].description).to.be('Updated description');
    });
    it('fails to update a dissertative question, with no key words', async () => {
      await request(app)
        .put(`/api/v1/question/${dissertativeQuestion.id}`)
        .set('Accept', /application\/json/)
        .send({
          keyWords: {}
        })
        .expect(httpStatus.BAD_REQUEST);
    });
    it("fails to update a dissertative question, that key words values sum isn't equal to 1", async () => {
      await request(app)
        .put(`/api/v1/question/${dissertativeQuestion.id}`)
        .set('Accept', /application\/json/)
        .send({
          keyWords: {
            'Key Word 1': 0.1,
            'Key Word 2': 0.2,
            'Key Word 3': 0.3,
            'Key Word 4': 0.3
          }
        })
        .expect(httpStatus.BAD_REQUEST);
    });
    it('fails to update a dissertative question, that a key word value is equal to 0', async () => {
      await request(app)
        .put(`/api/v1/question/${dissertativeQuestion.id}`)
        .set('Accept', /application\/json/)
        .send({
          keyWords: {
            'Key Word 1': 0.1,
            'Key Word 2': 0.2,
            'Key Word 3': 0.3,
            'Key Word 4': 0.4,
            'Key Word 5': 0
          }
        })
        .expect(httpStatus.BAD_REQUEST);
    });
  });
  describe('DELETE /question/:QuestionId', () => {
    let dissertativeQuestion;
    beforeEach(async () => {
      dissertativeQuestion = await Question.create(dataDissertative);
    });

    it('deletes a question', async () => {
      await request(app)
        .delete(`/api/v1/question/${dissertativeQuestion.id}`)
        .set('Accept', /application\/json/)
        .send()
        .expect(httpStatus.OK);
      expect(await Question.count()).to.be(0);
    });
  });

  describe('GET /question/:QuestionId', () => {
    let dissertativeQuestion;
    beforeEach(async () => {
      dissertativeQuestion = await Question.create(dataDissertative);
    });

    it('fetches a question with the given ID', async () => {
      const response = await request(app)
        .get(`/api/v1/question/${dissertativeQuestion.id}`)
        .set('Accept', /application\/json/)
        .send()
        .expect(httpStatus.OK);
      const { body } = await response.body;
      expect(body.id).to.be(dissertativeQuestion.id);
    });
  });
});
