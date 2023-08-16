const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET } = process.env;
const User = require('../models/user');

const ValidationError = require('../errors/Validation');
const ConflictError = require('../errors/ConflictError');
const UnauthorizedError = require('../errors/Unauthorized');
const NotFoundError = require('../errors/NotFound');

// async function registerUser(req, res, next) {
//   try {
//     const { email, password, name } = req.body;
//     const passwordHash = await bcrypt.hash(password, 10);

//     let user = await User.create({
//       email,
//       password: passwordHash,
//       name,
//     });

//     user = user.toObject();
//     delete user.password;
//     res.status(201).send(user);
//   } catch (err) {
//     if (err.name === 'ValidationError') {
//       next(new ValidationError('Неверные данные в  запросе'));
//       return;
//     }
//     if (err.code === 11000) {
//       next(new ConflictError('Пользователь с таким email уже существует'));
//       return;
//     }

//     next(err);
//   }
// }

const registerUser = (req, res, next) => {
  const { name, email, password } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, email, password: hash,
    }))
    .then((({ _id }) => User.findById(_id)))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Неверные данные в  запросе'));
        return;
      }
      if (err.code === 11000) {
        next(new ConflictError('Пользователь с таким email уже существует'));
        return;
      }
      next(err);
    })
    .catch(next);
};

async function loginUser(req, res, next) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      throw new UnauthorizedError('Неверные данные для входа');
    }

    const hasRightPassword = await bcrypt.compare(password, user.password);

    if (!hasRightPassword) {
      throw new UnauthorizedError('Неверные данные для входа');
    }

    const token = jwt.sign(
      {
        _id: user._id,
      },
      NODE_ENV === 'production' ? JWT_SECRET : 'secretkey',
      {
        expiresIn: '7d',
      },
    );

    res.send({ token });
  } catch (err) {
    next(err);
  }
}

const getCurrentUserInfo = (req, res, next) => {
  const userId = req.user._id;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      }
      res.send(user);
    })
    .catch(next);
};

// async function getCurrentUserInfo(req, res, next) {
//   try {
//     const userId = req.user._id;
//     const user = await User.findById(userId);

//     if (!user) {
//       throw new NotFoundError('Пользователь не найден');
//     }

//     res.send(user);
//   } catch (err) {
//     next(err);
//   }
// }

async function setUserInfo(req, res, next) {
  try {
    const userId = req.user._id;
    const { email, name } = req.body;
    const user = await User.findByIdAndUpdate(
      userId,
      { email, name },
      { new: true, runValidators: true },
    );

    if (!user) {
      throw new NotFoundError('Пользователь не найден');
    }

    res.send(user);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  registerUser,
  loginUser,

  getCurrentUserInfo,
  setUserInfo,
};
