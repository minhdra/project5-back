const Joi = require('joi');

const registerValidator = (data) => {
  const rule = Joi.object({
    ...data,
    username: Joi.string()
      .regex(/^(?:[A-Z\d][A-Z\d_-]{5,9})$/i)
      .required()
      .messages({
        'string.pattern.base':
          'Tài khoản phải có độ dài 5-10 và không có ký tự đặc biệt.',
      }),
    email: Joi.string()
      .regex(/^([A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4})$/i)
      .required()
      .messages({
        'string.pattern.base': 'Không đúng định dạng email.',
      }),
    password: Joi.string()
      .regex(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{5,11}$/i)
      .required()
      .messages({
        'string.pattern.base':
          'Mật khẩu phải có độ dài 6-12, gồm cả ký tự, số và ký tự đặc biệt.',
      }),
  }).messages({
    'string.empty': 'Không thể để trống',
    'any.required': 'Không thể để trống',
  });

  return rule.validate(data, { abortEarly: false });
};

const changePasswordValidator = (data) => {
  const rule = Joi.object({
    ...data,
    oldPassword: Joi.string().required(),
    newPassword: Joi.string()
      .regex(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{5,11}$/i)
      .required()
      .messages({
        'string.pattern.base':
          'Mật khẩu phải có độ dài 6-12, gồm cả ký tự, số và ký tự đặc biệt.',
      }),
  }).messages({
    'string.empty': 'Không thể để trống',
    'any.required': 'Không thể để trống',
  });

  return rule.validate(data);
};

module.exports.registerValidator = registerValidator;
module.exports.changePasswordValidator = changePasswordValidator;
