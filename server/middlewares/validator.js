const Joi = require("joi");

exports.signUpSchema = Joi.object({
  username: Joi.string().required().min(2),
  email: Joi.string()
    .min(6)
    .max(60)
    .required()
    .email({
      tlds: { allow: ["com", "net"] },
    }),
  password: Joi.string()
    .required()
    .pattern(
      new RegExp("^(?=.*[!@#$%^&*()_+\\-=\\[\\]{};'\":\\\\|,.<>/?]).+$")
    ),
});

exports.signInSchema = Joi.object({
  email: Joi.string()
    .min(6)
    .max(60)
    .required()
    .email({
      tlds: { allow: ["com", "net"] },
    }),
  password: Joi.string()
    .required()
    .pattern(
      new RegExp("^(?=.*[!@#$%^&*()_+\\-=\\[\\]{};'\":\\\\|,.<>/?]).+$")
    ),
});
