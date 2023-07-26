const Movie = require('../models/movie');

const ForbiddenError = require('../errors/Forbidden');
const NotFoundError = require('../errors/NotFound');
const ValidationError = require('../errors/Validation');

async function createMovie(req, res, next) {
  try {
    const {
      country,
      director,
      duration,
      year,
      description,
      image,
      trailerLink,
      thumbnail,
      movieId,
      nameRU,
      nameEN,
    } = req.body;

    const ownerId = req.user._id;

    const card = await Movie.create({
      country,
      director,
      duration,
      year,
      description,
      image,
      trailerLink,
      thumbnail,
      movieId,
      nameRU,
      nameEN,
      owner: ownerId,
    });

    res.status(201).send(card);
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new ValidationError('Неверные данные в запросе'));
      return;
    }

    next(err);
  }
}

async function receiveMovies(_, res, next) {
  try {
    const movies = await Movie.find({});
    res.send(movies);
  } catch (err) {
    next(err);
  }
}

async function deleteMovie(req, res, next) {
  try {
    const { movieId } = req.params;

    const movie = await Movie.findById(movieId).populate('owner');

    if (!movie) {
      throw new NotFoundError('Карточка не найдена');
    }

    const ownerId = movie.owner.id;
    const userId = req.user._id;

    if (ownerId !== userId) {
      throw new ForbiddenError('Нельзя удалить чужую карточку');
    }

    await Movie.findByIdAndRemove(movieId);

    res.send(movie);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createMovie,
  receiveMovies,
  deleteMovie,
};
