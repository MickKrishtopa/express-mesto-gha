const Card = require('../models/card');

const getCards = (req, res) => Card.find({})
  .then((cards) => res.status(200).send(cards))
  .catch(() => {
    res.status(500).send({
      message: 'Что-то пошло не так',
    });
  });

const createCard = (req, res) => {
  const newCardData = req.body;
  const newCardOwner = req.user._id;

  return Card.create({ ...newCardData, owner: newCardOwner })
    .then((newCard) => res.status(200).send(newCard))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({
          message: Object.values(err.errors)
            .map(() => err.message)
            .join(', '),
        });
      }

      return res.status(500).send({
        message: 'Что-то пошло не так.',
      });
    });
};

const removeCardById = (req, res) => {
  const { cardId } = req.params;
  return Card.findByIdAndDelete(cardId)
    .then((removedCard) => {
      if (!removedCard) {
        return res.status(404).send({
          message: 'Запрашиваемая карточка не найдена',
        });
      }
      return res.status(200).send(removedCard);
    })
    .catch(() => {
      if (cardId.length !== 12) {
        return res.status(400).send({
          message: 'Некорректный ID',
        });
      }
      return res.status(500).send({
        message: 'Что-то пошло не так.',
      });
    });
};

const putCardLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((newCard) => {
      if (!newCard) {
        return res.status(404).send({
          message: 'Запрашиваемая карточка не найдена',
        });
      }
      return res.status(200).send(newCard);
    })
    .catch(() => {
      if (req.params.cardId.length !== 12) {
        return res.status(400).send({
          message: 'Некорректный ID',
        });
      }
      return res.status(500).send({
        message: 'Что-то пошло не так.',
      });
    });
};

const removeCardLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((newCard) => {
      if (!newCard) {
        return res.status(404).send({
          message: 'Запрашиваемая карточка не найдена',
        });
      }
      return res.status(200).send(newCard);
    })
    .catch(() => {
      if (req.params.cardId.length !== 12) {
        return res.status(400).send({
          message: 'Некорректный ID',
        });
      }
      return res.status(500).send({
        message: 'Что-то пошло не так.',
      });
    });
};

module.exports = {
  getCards,
  createCard,
  removeCardById,
  putCardLike,
  removeCardLike,
};
