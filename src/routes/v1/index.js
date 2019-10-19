const allRoutes = require('express').Router();
const userRoutes = require('../../modules/users/users.routes');
const depRoutes = require('../../modules/deposits/dep.routes')

allRoutes.use(userRoutes);
allRoutes.use(depRoutes)

module.exports = allRoutes;
