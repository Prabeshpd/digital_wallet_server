import * as Joi from 'joi';

const authLogin = Joi.object().keys({
  email: Joi.string().email().max(50).required(),
  password: Joi.string().required()
});

export default authLogin;
