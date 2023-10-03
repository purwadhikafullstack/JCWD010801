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
				where: { [Op.or]: { username, email, phone } },
			});
			if (isAccountExist && isAccountExist.email === email) {
				throw { message: "E-mail has been used." };
			} else if (isAccountExist && isAccountExist.username === username) {
				throw { message: "Username has been used." };
			} else if (isAccountExist && isAccountExist.phone === phone) {
				throw { message: "Phone Number has been used." };
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
				error,
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
			const sortField = req.query.sortField || "firstName";
			const sortOrder = req.query.sortOrder || "ASC";
			const offset = (page - 1) * limit;
			const condition = { isDeleted: false, RoleId: 2 };
			const order = [[sortField, sortOrder]];
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
				order,
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
			if (checkLogin.RoleId === 1) throw { message: "You have to login on user login tab." };
			if (checkLogin.isVerified === 0) throw { message: "You are not verified. Please verify your E-mail" };

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
				error,
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

			if (!password) {
				return res.status(400).send({
					status: 400,
					message: "Password is required.",
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
	findAdminInfo: async (req, res) => {
		try {
			const admins = await users.findAll({
				where: {
					RoleId: {
						[Op.gt]: 1,
					},
				},
				attributes: ["id", "username", "RoleId"],
			});

			res.status(200).send({
				status: 200,
				message: "Admin usernames successfully fetched.",
				admins,
			});
		} catch (error) {
			return res.status(500).send({
				status: 500,
				message: "Internal server error.",
			});
		}
	},
	findUserInfo: async (req, res) => {
		try {
			const usersInfo = await users.findAll({
				where: {
					RoleId: {
						[Op.lt]: 2,
					},
				},
				attributes: ["id", "username", "RoleId"],
			});

			res.status(200).send({
				status: 200,
				message: "User usernames successfully fetched.",
				users: usersInfo,
			});
		} catch (error) {
			console.log(error);
			return res.status(500).send({
				status: 500,
				message: "Internal server error.",
			});
		}
	},
};
