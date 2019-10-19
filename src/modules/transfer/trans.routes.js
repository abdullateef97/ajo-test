const transRoutes = require('express').Router();
const {
  makeNewTransferController, completeTransferController,
  getAllTransfersController, getTransferDetailsController
} = require('./trans.controller');
const isAuthenticated = require('../../middlewares/isAuthenticated');

transRoutes.post('/transfer', isAuthenticated, makeNewTransferController);
transRoutes.post('/transfer/complete/:trans_id', isAuthenticated, completeTransferController)
transRoutes.get('/transfer', isAuthenticated, getAllTransfersController);
transRoutes.get('/transfer/:trans_id', isAuthenticated, getTransferDetailsController)

module.exports = transRoutes;
