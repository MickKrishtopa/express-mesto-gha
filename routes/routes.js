const router = require("express").Router();

const addOwnerId = require("../middlewares/addOwnerId.js");
const userRoutes = require("./users.js");
const cardsRoutes = require("./cards.js");

router.use("/", addOwnerId);
router.use("/users", userRoutes);
router.use("/cards", cardsRoutes);

module.exports = router;
