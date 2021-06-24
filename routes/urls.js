const express = require('express');
const FoodStallController = require('../controllers/foodstall.controller');

const router = express.Router();

const foodStallController = new FoodStallController();
foodStallController.register(router);

module.exports = router;
