const Joi = require('joi');

const validateSchema = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);
  return error ? next(error) : next();
};

const createTaskSchema = Joi.object({
  text: Joi.string().label('Text').required(),
}).unknown(true);

const moveTaskPositionSchema = Joi.object({
  position: Joi.number().integer().label('Position').required(),
}).unknown(true);

const moveTaskAndStatusSchema = Joi.object({
  position: Joi.number().integer().label('Position').required(),
  status: Joi.string().valid('todo', 'inProgress').label('Status').required(),
}).unknown(true);

const createTaskValidator = validateSchema(createTaskSchema);
const moveTaskPositionValidator = validateSchema(moveTaskPositionSchema);
const moveTaskAndStatusValidator = validateSchema(moveTaskAndStatusSchema);

module.exports = {
  createTaskValidator,
  moveTaskPositionValidator,
  moveTaskAndStatusValidator,
};
