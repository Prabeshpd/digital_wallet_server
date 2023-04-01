import * as Joi from 'joi';

const user = Joi.object().keys({
  password: Joi.string().required(),
  email: Joi.string().email().max(50).required(),
  name: Joi.string().max(30).required()
});

export default user;
