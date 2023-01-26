var express = require('express');
var router = express.Router();
var StatisticController = require('../controllers/StatisticController');
var verifyToken = require('../middleware/verifyToken');

/* GET users listing. */
router.post('/users-of-month', verifyToken, StatisticController.statisticUserOfMonth);
router.post('/total-of-month', verifyToken, StatisticController.calculateTotalOfMonth);
router.post('/total-of-all', verifyToken, StatisticController.calculateTotalOfAllTime);
router.post('/orders-delivered-of-month', verifyToken, StatisticController.statisticOrdersDeliveredOfMonth);
router.post('/orders-unverified', verifyToken, StatisticController.statisticOrdersUnverified);
router.post('/count-products', verifyToken, StatisticController.statisticProducts);

module.exports = router;
