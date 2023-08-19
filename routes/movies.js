const express = require('express');
const { celebrate, Joi } = require('celebrate');

const { validateObjectId } = require('../utils/validateObjectId');

const {
  receiveMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');

const paramsValidationConfig = {
  params: Joi.object().keys({
    movieId: Joi.string().required().custom(validateObjectId),
  }),
};

const movies = express.Router();

movies.get('/', receiveMovies);

movies.post(
  '/',
  celebrate({
    body: Joi.object().keys({
      country: Joi.string().required(),
      director: Joi.string().required(),
      duration: Joi.number().required(),
      year: Joi.string().required(),
      description: Joi.string().required(),
      image: Joi.string().required().regex(/https?:\/\/(www)?[0-9a-z\-._~:/?#[\]@!$&'()*+,;=]+#?$/i),
      trailerLink: Joi.string().required().regex(/https?:\/\/(www)?[0-9a-z\-._~:/?#[\]@!$&'()*+,;=]+#?$/i),
      thumbnail: Joi.string().required().regex(/https?:\/\/(www)?[0-9a-z\-._~:/?#[\]@!$&'()*+,;=]+#?$/i),
      owner: Joi.string().required().custom(validateObjectId),
      movieId: Joi.number().required(),
      nameRU: Joi.string().required(),
      nameEN: Joi.string().required(),
    }),
  }),
  createMovie,
);

movies.delete('/:movieId', celebrate(paramsValidationConfig), deleteMovie);

module.exports = { movies };
