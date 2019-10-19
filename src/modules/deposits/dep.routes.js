const depRoutes = require('express').Router();
const {
  initiateNewDepController, verifyDepositController
} = require('./dep.controller');
const isAuthenticated = require('../../middlewares/isAuthenticated');

depRoutes.post('/deposits', isAuthenticated, initiateNewDepController);
depRoutes.get('/deposits/verify', verifyDepositController)

module.exports = depRoutes;
