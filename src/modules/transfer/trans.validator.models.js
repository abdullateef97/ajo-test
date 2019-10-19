const Joi = require('joi');

const TransferValidatorModel = Joi.object().keys({
    amount: Joi.number().required(),
    recipient_wallet_id: Joi.string().required(),
    pin: Joi.string().length(4).required()
})

const CompleteTransferValidatorModel = Joi.object().keys({
    otp: Joi.string().required()
})




module.exports = {
    TransferValidatorModel, CompleteTransferValidatorModel
}