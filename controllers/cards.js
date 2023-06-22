const statusCodes = require('http').STATUS_CODES;
const httpConstants = require('http2').constants;
const mongoose = require('mongoose');

const Card = require('../models/card');

const getCards = (req, res) => Card.find({})
  .then((cards) => res.status(httpConstants.HTTP_STATUS_OK).send(cards))
  .catch(() => {
    res.status(httpConstants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({
      message: `${statusCodes[httpConstants.HTTP_STATUS_INTERNAL_SERVER_ERROR]}`,
    });
  });

const createCard = (req, res) => {
  const newCardData = req.body;
  const newCardOwner = req.user._id;

  return Card.create({ ...newCardData, owner: newCardOwner })
    .then((newCard) => res.status(httpConstants.HTTP_STATUS_CREATED).send(newCard))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(httpConstants.HTTP_STATUS_BAD_REQUEST).send({
          message: Object.values(err.errors)
            .map(() => err.message)
            .join(', '),
        });
      }

      return res.status(httpConstants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({
        message: `${statusCodes[httpConstants.HTTP_STATUS_INTERNAL_SERVER_ERROR]}`,
      });
    });
};

const removeCardById = (req, res) => {
  const { cardId } = req.params;
  return Card.findByIdAndDelete(cardId)
    .orFail(new Error('CardNotFound'))
    .then((removedCard) => res.status(httpConstants.HTTP_STATUS_OK).send(removedCard))
    .catch((err) => {
      if (err.message === 'CardNotFound') {
        return res.status(httpConstants.HTTP_STATUS_NOT_FOUND).send({
          message: `${statusCodes[httpConstants.HTTP_STATUS_NOT_FOUND]}`,
        });
      }
      if (err instanceof mongoose.Error.CastError) {
        return res.status(httpConstants.HTTP_STATUS_BAD_REQUEST).send({
          message: `${statusCodes[httpConstants.HTTP_STATUS_BAD_REQUEST]}, Invalid ID`,
        });
      }
      return res.status(httpConstants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({
        message: `${statusCodes[httpConstants.HTTP_STATUS_INTERNAL_SERVER_ERROR]}`,
      });
    });
};

const toggleCardLike = (req, res, action) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    action,
    { new: true },
  )
    .orFail(new Error('CardNotFound'))
    .then((newCard) => res.status(httpConstants.HTTP_STATUS_OK).send(newCard))
    .catch((err) => {
      if (err.message === 'CardNotFound') {
        return res.status(httpConstants.HTTP_STATUS_NOT_FOUND).send({
          message: `${statusCodes[httpConstants.HTTP_STATUS_NOT_FOUND]}`,
        });
      }
      if (err instanceof mongoose.Error.CastError) {
        return res.status(httpConstants.HTTP_STATUS_BAD_REQUEST).send({
          message: `${statusCodes[httpConstants.HTTP_STATUS_BAD_REQUEST]}, Invalid ID`,
        });
      }
      return res.status(httpConstants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({
        message: `${statusCodes[httpConstants.HTTP_STATUS_INTERNAL_SERVER_ERROR]}`,
      });
    });
};

const putCardLike = (req, res) => {
  toggleCardLike(req, res, { $addToSet: { likes: req.user._id } });
};

const removeCardLike = (req, res) => {
  toggleCardLike(req, res, { $pull: { likes: req.user._id } });
};

module.exports = {
  getCards,
  createCard,
  removeCardById,
  putCardLike,
  removeCardLike,
};
