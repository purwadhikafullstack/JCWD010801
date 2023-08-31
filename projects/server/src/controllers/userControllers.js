const db = require('../models');
const user = db.User;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require("fs");
const handlebars = require("handlebars");
const { Op } = require("sequelize");

module.exports = {
    userLogin: async (req, res) => {
        try {
            const { data, password } = req.body;
            const checkLogin = await user.findOne({
                where: {
                    [Op.or]: [
                        { email: data },
                        { username: data },
                    ]
                }
            });
            if (!checkLogin) throw { message: "User not Found." };
            if (checkLogin.RoleId != 1) throw { message: "You have to Login on admin login" }

            const isValid = await bcrypt.compare(password, checkLogin.password);
            if (!isValid) throw { message: "Password Incorrect." };

            const payload = { id: checkLogin.id };
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
    adminLogin: async (req, res) => {
        try {
            const { data, password } = req.body;
            const checkLogin = await user.findOne({
                where: {
                    [Op.or]: [
                        { email: data },
                        { username: data },
                    ]
                }
            });
            if (!checkLogin) throw { message: "User not Found." };
            if (checkLogin.RoleId == 1) throw { message: "You have to Login on user Login." }

            const isValid = await bcrypt.compare(password, checkLogin.password);
            if (!isValid) throw { message: "Password Incorrect." };

            const payload = { id: checkLogin.id, RoleId: checkLogin.RoleId };
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
    keepLogin: async (req, res) => {
        try {
            const result = await user.findOne({
                where: {
                    id: req.user.id
                }
            });
            res.status(200).send(result);
        } catch (error) {
            res.status(500).send({
                status: 500,
                message: "Internal server error."
            });
        }
    },
}
