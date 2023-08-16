const express = require('express');
const { celebrate, Joi } = require('celebrate');

const { getCurrentUserInfo, getUserInfo, setUserInfo } = require('../controllers/users');

const users = express.Router();

users.get(
  '/me',
  celebrate({
    params: Joi.object().keys({
      userId: Joi.length(24).hex(),
    }),
  }),
  getCurrentUserInfo,
);

// users.get('/', getUsersInfo);

users.get(
  '/:userId',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      email: Joi.string().required().email(),
    }),
  }),
  getUserInfo,
);

users.patch(
  '/me',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().email().required(),
      name: Joi.string().required().min(2).max(30),
    }),
  }),
  setUserInfo,
);

module.exports = { users };
