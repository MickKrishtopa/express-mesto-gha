const httpConstants = require('http2').constants;
const mongoose = require('mongoose');

const Card = require('../models/card');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const ValidationError = require('../errors/ValidationError');
const ForbiddenError = require('../errors/ForbiddenError');

const getCards = (req, res, next) => Card.find({})
  .then((cards) => res.status(httpConstants.HTTP_STATUS_OK).send(cards))
  .catch(next);

const createCard = (req, res, next) => {
  const newCardData = req.body;
  const newCardOwner = req.user._id;

  return Card.create({ ...newCardData, owner: newCardOwner })
    .then((newCard) => res.status(httpConstants.HTTP_STATUS_CREATED).send(newCard))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return next(new ValidationError(Object.values(err.errors)
          .map((error) => error.message)
          .join(', ')));
      }

      return next(err);
    });
};

const removeCardById = (req, res, next) => {
  const { cardId } = req.params;
  return Card.findById(cardId)
    .orFail(new NotFoundError())
    .then((card) => {
      if (card && card.owner.valueOf() !== req.user._id) {
        return next(new ForbiddenError());
      }

      return Card.findByIdAndDelete(cardId)
        .then((removedCard) => res.status(httpConstants.HTTP_STATUS_OK).send(removedCard));
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return next(new BadRequestError());
      }
      return next(err);
    });
};

const toggleCardLike = (req, res, next, action) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { [action]: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new NotFoundError())
    .then((newCard) => res.status(httpConstants.HTTP_STATUS_OK).send(newCard))
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return next(new BadRequestError());
      }
      return next(err);
    });
};

const putCardLike = (req, res, next) => {
  toggleCardLike(req, res, next, '$addToSet');
};

const removeCardLike = (req, res, next) => {
  toggleCardLike(req, res, next, '$pull');
};

module.exports = {
  getCards,
  createCard,
  removeCardById,
  putCardLike,
  removeCardLike,
};
