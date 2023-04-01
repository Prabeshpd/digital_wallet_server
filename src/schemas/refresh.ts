import * as Joi from 'joi';

const refresh = Joi.object().keys({
  refreshToken: Joi.string().required()
});

export default refresh;
