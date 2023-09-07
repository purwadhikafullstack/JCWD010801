const db = require("../models");
const users = db.Users;
const branches = db.Branches;
const role = db.Roles;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");

module.exports = {
	adminRegister: async (req, res) => {
		try {
			const {
				username,
				firstName,
				lastName,
				email,
				phone,
				password,
				BranchId,
			} = req.body;
			const isAccountExist = await users.findOne({
				where: { [Op.or]: { username, email } },
			});
			if (isAccountExist && isAccountExist.email === email) {
				throw { message: "Enail has been used" };
			} else if (isAccountExist && isAccountExist.username === username) {
				throw { message: "Username has been used" };
			}

			const salt = await bcrypt.genSalt(10);
			const hashPassword = await bcrypt.hash(password, salt);
			const result = await users.create({
				username,
				firstName,
				lastName,
				email,
				phone,
				password: hashPassword,
				BranchId,
				RoleId: 2,
				isVerified: true,
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
			const page = +req.query.page || 1;
			const limit = +req.query.limit || 8;
			const search = req.query.search;
			const offset = (page - 1) * limit;
			const condition = { isDeleted: false, RoleId: 2 };
			if (search) condition["username"] = { [Op.like]: `%${search}%` };
			const result = await users.findAll({
				where: condition,
				include: [{ model: branches }, { model: role }],
				limit,
				offset,
			});
			const countAdmins = await users.count({
				where: condition,
			});
			res.status(200).send({
				countAdmins,
				totalPage: Math.ceil(countAdmins / limit),
				currentPage: page,
				result,
			});
		} catch (error) {
			res.status(400).send(error);
		}
	},
	getAdmin: async (req, res) => {
		try {
			const result = await branches.findAll({
				where: { id: req.params.id },
				include: [{ model: users, model: role }],
			});
			res.status(200).send(result);
		} catch (error) {
			res.status(200).send(error);
		}
	},
	getBranches: async (req, res) => {
		try {
			const result = await branches.findAll({});
			res.status(200).send(result);
		} catch (error) {
			res.status(200).send(error);
		}
	},
};
