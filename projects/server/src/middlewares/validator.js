const { body, validationResult } = require("express-validator")

module.exports = {
    checkRegister: async (req, res, next) => {
        try {
          await body("username")
            .notEmpty()
            .withMessage("Username must not be empty")
            .run(req);
          await body("firstName")
            .notEmpty()
            .withMessage("First name must not be empty")
            .run(req);
          await body("lastName")
            .notEmpty()
            .withMessage("Last name must not be empty")
            .run(req);
          await body("email")
            .notEmpty()
            .withMessage("Email must not be empty")
            .isEmail()
            .withMessage("invalid email")
            .run(req);
          await body("phone")
            .notEmpty()
            .withMessage("Phone must not be empty")
            .isMobilePhone()
            .withMessage("invalid phone number")
            .run(req);
          await body("password")
            .notEmpty()
            .withMessage("Password must not be empty")
            .isStrongPassword({
              minLength: 6,
              minLowercase: 1,
              minUppercase: 1,
              minNumbers: 1,
              minSymbols: 1,
            })
            .withMessage(
              "Password must be at least 6 characters long and contain at least one lowercase letter, one uppercase letter, one number, and one symbol"
            )
            .run(req);
          await body("confirmPassword")
            .notEmpty()
            .withMessage("Confirm password must not be empty")
            .equals(req.body.password)
            .withMessage("Passwords do not match")
            .run(req);
          const validation = validationResult(req);
          if (validation.isEmpty()) {
            next();
          } else {
            return res.status(400).send({
              status: false,
              message: "Invalid validation",
              error: validation.array(),
            });
          }
        } catch (error) {
          console.log(error);
        }
      },
}
