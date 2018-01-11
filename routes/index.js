const express = require('express');
const router = express.Router();

const coinController = require('../controllers/coin-controller.js')

//http://localhost:3000/api/v1/coin
router.get('/', coinController.scrape)

module.exports = router;
