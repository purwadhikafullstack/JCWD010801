const db = require("../models");
const user = db.User;
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");
const jwt = require("jsonwebtoken");
const transporter = require("../middlewares/transporter");
const fs = require("fs");
const handlebars = require("handlebars");
module.exports = {
  register: async (req, res) => {
    try {
      const { username, firstName, lastName,email, phone, password } = req.body;
      const isAccountExist = await user.findOne({
        where: { [Op.or]: { username, email } },
      });
      if (isAccountExist && isAccountExist.email === email) {
        throw { message: "Enail has been used" };
      } else if (isAccountExist && isAccountExist.username === username) {
        throw { message: "Username has been used" };
      }
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);
      const result = await user.create({
        username,
        firstName,
        lastName,
        email,
        phone,
        password: hashPassword,
      });
      const payload = { id: result.id };
      const token = jwt.sign(payload, process.env.KEY_JWT, { expiresIn: "1h" });
      const data = await fs.readFileSync("./src/templates/templateVerification.html", "utf-8");
      const tempCompile = await handlebars.compile(data);
      const tempResult = tempCompile({ username, token });
      await transporter.sendMail({
        from: process.env.NODEMAILER_USER,
        to: email,
        subject: "Verify account",
        html: tempResult,
      });
      res.status(200).send({
        status: true,
        message: "Register success. Check your email to verify",
        result,
      });
    } catch (error) {
      res.status(400).send(error);
      
    }
  },
};
