import * as Joi from 'joi';

const wallet = Joi.object().keys({
  userId: Joi.string().required(),
  transactionPassword: Joi.string().required()
});

export default wallet;
