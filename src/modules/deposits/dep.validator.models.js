const Joi = require('joi');

const InitiateDepositValidatorModel = Joi.object().keys({
    amount: Joi.number().required(),
})




module.exports = {
    InitiateDepositValidatorModel
}