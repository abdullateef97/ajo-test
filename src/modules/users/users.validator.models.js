const Joi = require('@hapi/joi');

const LoginValidatorModel = Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required()
})

const SignUpValidatorModel = Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    pin: Joi.string().length(4).required(),
    name: Joi.string().required(),
    phone_number: Joi.string().required()
})



module.exports = {
    LoginValidatorModel, SignUpValidatorModel
}