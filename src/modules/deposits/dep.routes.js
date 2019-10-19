const depRoutes = require('express').Router();
const {
  initiateNewDepController, verifyDepositController, getAllDepositsController,
  getDepositsDetailsController
} = require('./dep.controller');
const isAuthenticated = require('../../middlewares/isAuthenticated');

depRoutes.post('/deposits', isAuthenticated, initiateNewDepController);
depRoutes.get('/deposits/all', isAuthenticated, getAllDepositsController);
depRoutes.get('/deposits/verify', verifyDepositController)
depRoutes.get('/deposits/det/:deps_id', isAuthenticated, getDepositsDetailsController)

module.exports = depRoutes;
