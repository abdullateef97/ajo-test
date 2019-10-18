const userRoutes = require('express').Router();
const {
  loginUserController,
  createNewUserController,
  getUserDetailsController
} = require('./users.controller');
const isAuthenticated = require('../../middlewares/isAuthenticated');

userRoutes.post('/users', createNewUserController);
userRoutes.post('/users/login', loginUserController);
userRoutes.get('/users', isAuthenticated, getUserDetailsController);

module.exports = userRoutes;
