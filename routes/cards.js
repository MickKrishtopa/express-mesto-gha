const router = require("express").Router();

const {
  getCards,
  createCard,
  removeCardById,
  putCardLike,
  removeCardLike,
} = require("../controllers/cards.js");

router.get("/", getCards);
router.post("/", createCard);
router.delete("/:cardId", removeCardById);
router.put("/:cardId/likes", putCardLike);
router.delete("/:cardId/likes", removeCardLike);

module.exports = router;
