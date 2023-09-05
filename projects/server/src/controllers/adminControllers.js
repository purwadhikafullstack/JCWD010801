const db = require("../models");
const user = db.User;
const branch = db.Branches;
const role = db.Roles;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { Op } = require("sequelize");

module.exports = {
    adminRegister: async (req, res) => {
        try {
            const { username, firstName, lastName, email, phone, password, BranchId } = req.body;
            const isAccountExist = await user.findOne({
                where: { [Op.or]: { username, email } },
            });
            if (isAccountExist && isAccountExist.email === email) {
                throw { message: "Enail has been used" };
            } else if (isAccountExist && isAccountExist.username === username) {
                throw { message: "Username has been used" };
            };

            const salt = await bcrypt.genSalt(10);
            const hashPassword = await bcrypt.hash(password, salt);
            const result = await user.create({
                username,
                firstName,
                lastName,
                email,
                phone,
                password: hashPassword,
                RoleId: 2,
                isVerified: true,
                BranchId
            });
            const payload = { id: result.id };
            const token = jwt.sign(payload, process.env.KEY_JWT, { expiresIn: "1h" });
            res.status(200).send({
                status: true,
                result,
                token,
            });
        } catch (error) {
            res.status(400).send(error);
        }
    },
    getAllAdmins: async (req, res) => {
        try {
            const result = await user.findAll({
                where: { RoleId: 2 },
                include: [{ model: branch}, { model: role }]
            })
            res.status(200).send(result)
        } catch (error) {
            res.status(400).send(error)
        }
    },
    getAdmin: async (req, res) => {
        try {
            const result = await branch.findAll({
                where: { id: req.params.id },
                include: [{ model: user, model: role }]
            })
            res.status(200).send(result)
        } catch (error) {
            res.status(200).send(error)
        }
    },
};