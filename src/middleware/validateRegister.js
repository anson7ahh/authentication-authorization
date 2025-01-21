const Joi = require("joi");

// Schema validation
const userSchema = Joi.object({
  fullName: Joi.string().alphanum().min(3).max(30).required().messages({
    "string.empty": "Full name is required",
    "string.min": "Full name must be at least 3 characters",
    "string.max": "Full name must not exceed 30 characters",
  }),
  password: Joi.string()
    .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
    .required()
    .messages({
      "string.empty": "Password is required",
      "string.pattern.base":
        "Password must contain only alphanumeric characters and be between 3-30 characters",
    }),
  confirmPassword: Joi.string().valid(Joi.ref("password")).required().messages({
    "any.only": "Confirm password must match the password",
  }),
  email: Joi.string()
    .required()
    .pattern(
      new RegExp(
        '^(([^<>()\\[\\]\\\\.,;:\\s@"]+(\\.[^<>()\\[\\]\\\\.,;:\\s@"]+)*)|(".+"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$'
      )
    )
    .messages({
      "string.empty": "Email is required",
      "string.pattern.base": "Email must be a valid email address",
    }),

  phoneNumber: Joi.string()
    .pattern(
      /^((\+\d{1,2}(-| )?(| )\(?\d\)?(-| )?\d{1,3})|(\(?\d{2,3}\)?)?(\\d{4}(| )(\\-\\d{4})?)?)(-| )?(\d{3,4})(-| )?(\d{4})(( x| ext)\d{1,4}){0,1}|(\+\d{2}(| )\(\d{3}\)(| )\d{3}(| )\d{4})$/
    )
    .required()
    .messages({
      "string.empty": "Phone number is required",
      "string.pattern.base": "Phone number must be between 10 to 15 digits",
    }),
});

// Middleware function
const validateRegister = (req, res, next) => {
  const { error } = userSchema.validate(req.body, { abortEarly: false });
  if (error) {
    // Format error messages
    const errors = error.details.map((detail) => detail.message);
    return res.status(400).json({ errors });
  }
  next(); // Proceed to the next middleware/controller
};

module.exports = validateRegister;
