require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const cors = require('cors');

const { requestLogger, errorLogger } = require('./middlewares/logger');

const { routes } = require('./routes');
const { handleError } = require('./middlewares/handleError');

const URL = 'mongodb://127.0.0.1:27017/bitfilmsdb';
const { PORT = 3000 } = process.env;

const app = express();

// Подключения
mongoose.connect(URL)
  .then(() => {
    console.log(`Connected to database on ${URL}`);
  })
  .catch((err) => {
    console.log('Error on database connection');
    console.error(err);
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// CORS
app.use(cors());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 минут
  max: 100, // 100 запросов с одного IP
});

// Логгер запросов
app.use(requestLogger);

// Лимитер
app.use(limiter);

// Helmet
app.use(helmet());

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

// Роуты
app.use(routes);

// Ошибки
app.use(errorLogger);
app.use(errors());
app.use(handleError);

app.listen(PORT, () => {
  console.log(`App started on port ${PORT}`);
});
