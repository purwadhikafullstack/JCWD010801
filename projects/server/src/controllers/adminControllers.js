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
			const { username, firstName, lastName, email, phone, password, BranchId } = req.body;
			const isAccountExist = await users.findOne({
				where: { [Op.or]: { username, email } },
			});
			if (isAccountExist && isAccountExist.email === email) {
				throw { message: "E-mail has been used." };
			} else if (isAccountExist && isAccountExist.username === username) {
				throw { message: "Username has been used." };
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
				status: 200,
				result,
				token,
			});
		} catch (error) {
			return res.status(500).send({
				status: 500,
				message: "Internal server error.",
			});
		}
	},
	getAllAdmins: async (req, res) => {
		try {
			const page = +req.query.page || 1;
			const limit = +req.query.limit || 8;
			const search = req.query.search;
			const branchId = req.query.branchId;
			const offset = (page - 1) * limit;
			const condition = { isDeleted: false, RoleId: 2 };
			if (search) {
				condition[Op.or] = [
					{
						username: {
							[Op.like]: `%${search}%`,
						},
					},
					{
						firstName: {
							[Op.like]: `%${search}%`,
						},
					},
					{
						lastName: {
							[Op.like]: `%${search}%`,
						},
					},
				];
			}
			if (branchId) condition["BranchId"] = branchId;
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
				totalPage: Math.ceil(countAdmins / limit),
				currentPage: page,
				countAdmins,
				result,
			});
		} catch (error) {
			return res.status(500).send({
				status: 500,
				message: "Internal server error.",
			});
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
			return res.status(500).send({
				status: 500,
				message: "Internal server error.",
			});
		}
	},
	getBranches: async (req, res) => {
		try {
			const result = await branches.findAll({});
			res.status(200).send(result);
		} catch (error) {
			return res.status(500).send({
				status: 500,
				message: "Internal server error.",
			});
		}
	},
	login: async (req, res) => {
		try {
			const { data, password } = req.body;
			const checkLogin = await users.findOne({
				where: {
					[Op.or]: [{ email: data }, { username: data }],
				},
			});
			if (!checkLogin) throw { message: "User is not found." };
			if (checkLogin.RoleId == 1) throw { message: "You have to login on user login tab." };

			const isValid = await bcrypt.compare(password, checkLogin.password);
			if (!isValid) throw { message: "Password is incorrect." };

			const payload = { id: checkLogin.id, RoleId: checkLogin.RoleId };
			const token = jwt.sign(payload, process.env.KEY_JWT, { expiresIn: "3h" });

			res.status(200).send({
				status: 200,
				message: "Login successful.",
				token,
				checkLogin,
			});
		} catch (error) {
			return res.status(500).send({
				status: 500,
				message: "Internal server error.",
			});
		}
	},
	confirmPassword: async (req, res) => {
		try {
			const { UID } = req.params;
			const { password } = req.body;
			const user = await users.findOne({ where: { id: UID } });

			if (!user) {
				return res.status(404).send({
					status: 404,
					message: "User is not found.",
				});
			}

			const isValid = await bcrypt.compare(password, user.password);
			if (!isValid) {
				return res.status(401).send({
					status: 401,
					message: "Unauthorized! The password you entered is incorrect.",
				});
			}

			res.status(200).send({
				status: 200,
				message: "Action authorized.",
			});
		} catch (error) {
			return res.status(500).send({
				status: 500,
				message: "Internal server error.",
			});
		}
	},
};
