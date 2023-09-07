const db = require('../models');
const users = db.Users;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require("fs");
const handlebars = require("handlebars");
const { Op } = require("sequelize");
const transporter = require("../middlewares/transporter");

module.exports = {
    userLogin: async (req, res) => {
        try {
            const { data, password } = req.body;
            const checkLogin = await users.findOne({
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
            const checkLogin = await users.findOne({
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
            const result = await users.findOne({
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
    register: async (req, res) => {
        try {
            const { username, firstName, lastName, email, phone, password } = req.body;
            const isAccountExist = await users.findOne({
                where: { [Op.or]: { username, email } },
            });
            if (isAccountExist && isAccountExist.email === email) {
                throw { message: "Enail has been used" };
            } else if (isAccountExist && isAccountExist.username === username) {
                throw { message: "Username has been used" };
            };

            const salt = await bcrypt.genSalt(10);
            const hashPassword = await bcrypt.hash(password, salt);
            const result = await users.create({
                username,
                firstName,
                lastName,
                email,
                phone,
                password: hashPassword,
                RoleId: 1,
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
                token,
            });
        } catch (error) {
            res.status(400).send(error);
        }
    },
    verificationAccount: async (req, res) => {
        try {
            const isAccountExist = await users.findOne({
                where: {
                    id: req.user.id,
                }
            })
            if (isAccountExist.isVerified) throw { message: "Account is already verified" }
            const result = await users.update(
                {
                    isVerified: true,
                },
                {
                    where: {
                        id: isAccountExist.id,
                    },
                }
            );
            res.status(200).send({
                message: "Verify success",
                result
            });

        } catch (error) {
            res.status(400).send(error);
        }
    },
    forgotPassword: async(req, res) => {
        try {
            const result = await users.findOne({ where: { email: req.body.email } });
            if ( !result ) throw { message: 'Email not found' };

            const payload = { id: result.id };
            const token = jwt.sign( payload, process.env.KEY_JWT, { expiresIn: '1d' } );

            const data = await fs.readFileSync( './src/templates/resetPassword.html', 'utf-8' );
            const tempCompile = await handlebars.compile( data );
            const tempResult = tempCompile( { username: result.username, token } );
            await transporter.sendMail({
                from: process.env.NODEMAILER_USER,
                to: req.body.email,
                subject: 'Reset Password',
                html: tempResult
            });

            res.status(200).send({
                status: true,
                message: 'Reset password link sent. Please check your email.',
                token
            });
            
        } catch (err) {
            res.status(400).send(err);
        }
    },
    resetPassword: async(req, res) => {
        try {
            const salt = await bcrypt.genSalt(10);
            const hashPassword = await bcrypt.hash( req.body.password, salt );
            users.update({ password: hashPassword }, { where: { id: req.user.id } });

            res.status(200).send({
                status: true,
                message: 'Reset password successful'
            });

        } catch (err) {
            res.status(400).send(err);
        }
    }
};