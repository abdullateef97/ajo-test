const Joi = require('@hapi/joi');
const customError = require('../utils/handleCustomErrors')
const HttpStatus = require('../constants/httpStatus')
const responseMessages = require('../constants/responseMessages');



exports.validateSchema = (res, schema, data) => new Promise((resolve, reject) => {
    
    if(!schema) return reject({message : responseMessages.emptyJoiSchema});
    if(!data) return reject({message : responseMessages.FORM_BODY_EMPTY, code: HttpStatus.BAD_REQUEST});
    return Joi.validate(data, schema, (err, value) => {
        if(err) return reject({message : err.details[0].message, code: HttpStatus.BAD_REQUEST});
        return resolve();
    })
})



