const express = require('express');
const { celebrate, Joi } = require('celebrate');

const { users } = require('./users');
const { movies } = require('./movies');
const { loginUser, registerUser } = require('../controllers/users');
const { auth } = require('../middlewares/auth');
const NotFoundError = require('../errors/NotFound');

const routes = express.Router();

routes.all('*', express.json());

routes.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
      name: Joi.string().min(2).max(30),
    }),
  }),
  registerUser,
);

routes.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    }),
  }),
  loginUser,
);

routes.use('/users', auth, users);
routes.use('/movies', auth, movies);

routes.all('*', (req, res, next) => {
  next(new NotFoundError('Неверный адрес запроса'));
});

module.exports = { routes };
