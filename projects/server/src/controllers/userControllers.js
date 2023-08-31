const db = require('../models');
const user = db.User;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require("fs");
const handlebars = require("handlebars");

module.exports = {
    userLogin: async (req, res) => {
        try {
            const { email, password } = req.body;
            const checkLogin = await user.findOne({ where: { email: email } });
            if (!checkLogin) throw { message: "User not Found." };
            
            const isValid = await bcrypt.compare(password, checkLogin.password);
            if (!isValid) throw { message: "Username or Password Incorrect." };

            const payload = { id: checkLogin.id};
            const token = jwt.sign(payload, process.env.KEY_JWT, { expiresIn: "3h" });

            res.status(200).send({
                message: "Login success",
                token
            });
        } catch (error) {
            res.status(500).send({
                error,
                status: 500,
                message: 'Internal server error',
            });
        }
    },
}
