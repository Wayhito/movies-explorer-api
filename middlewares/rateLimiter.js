const rateLimiter = require('express-rate-limit');

const limiter = rateLimiter({
  max: 160,
  windowMS: 55000,
  message: 'Превышено количество запросов на сервер. Повторите позднее',
});

module.exports = limiter;
