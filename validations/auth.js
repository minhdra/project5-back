const Joi = require('joi');

const registerValidator = (data) => {
    const rule = Joi.object({
        username: Joi.string().min(6).max(225).required(),
        email: Joi.string().min(6).max(225).required().email(),
        password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{6,20}$')).required(),
    }).messages({
        'string.pattern.base': 'Your {#label} length must be greater than 6 characters. Password cannot contain a special character.'
    })

    return rule.validate(data);
}

const changePasswordValidator = (data) => {
    const rule = Joi.object({
        password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{6,20}$')).required(),
    });

    return rule.validate(data);
}

module.exports.registerValidator = registerValidator;
module.exports.changePasswordValidator = changePasswordValidator;