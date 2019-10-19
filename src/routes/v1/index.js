const allRoutes = require('express').Router();
const userRoutes = require('../../modules/users/users.routes');
const depRoutes = require('../../modules/deposits/dep.routes');
const transRoutes = require('../../modules/transfer/trans.routes')

allRoutes.use(userRoutes);
allRoutes.use(depRoutes);
allRoutes.use(transRoutes)

module.exports = allRoutes;
