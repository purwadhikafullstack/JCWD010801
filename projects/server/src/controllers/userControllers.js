const path = require("path");
const db = require("../models");
const users = db.Users;
const user_vouchers = db.User_vouchers;
const vouchers = db.Vouchers;
const orders = db.Orders;
const order_details = db.Order_details;
const products = db.Products;
const notifications = db.Notifications;
const tokenVerification = db.Tokens;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const handlebars = require("handlebars");
const { Op } = require("sequelize");
const transporter = require("../middlewares/transporter");

module.exports = {
	login: async (req, res) => {
		try {
			const { data, password } = req.body;
			const checkLogin = await users.findOne({
				where: {
					[Op.or]: [{ email: data }, { username: data }],
				},
			});
			if (!checkLogin) throw { message: "User is not found." };
			if (checkLogin.RoleId !== 1) throw { message: "Please login on the admin login tab." };

			const isValid = await bcrypt.compare(password, checkLogin.password);
			if (!isValid) throw { message: "Password is incorrect." };

			const payload = { id: checkLogin.id, RoleId: checkLogin.RoleId };
			const token = jwt.sign(payload, process.env.KEY_JWT, { expiresIn: "3h" });

			res.status(200).send({
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
	keepLogin: async (req, res) => {
		try {
			const result = await users.findOne({
				where: {
					id: req.user.id,
				},
			});
			res.status(200).send(result);
		} catch (error) {
			return res.status(500).send({
				error,
				status: 500,
				message: "Internal server error.",
			});
		}
	},
	register: async (req, res) => {
		const transaction = await db.sequelize.transaction();
		try {
			const { username, firstName, lastName, email, phone, password, referralCode } = req.body;
			const isAccountExist = await users.findOne({
				where: { [Op.or]: { username, email, phone } },
			});
			if (isAccountExist && isAccountExist.email === email) {
				throw { message: "E-mail has been used." };
			} else if (isAccountExist && isAccountExist.username === username) {
				throw { message: "Username has been used." };
			} else if (isAccountExist && isAccountExist.phone === phone) {
				throw { message: "Phone number has been used." };
			}

			const salt = await bcrypt.genSalt(10);
			const hashPassword = await bcrypt.hash(password, salt);
			const newReferralCode = (await bcrypt.hash("REFERRALCODE", salt)).slice(8, 16);
			const result = await users.create({
				username,
				firstName,
				lastName,
				email,
				phone,
				password: hashPassword,
				RoleId: 1,
				referralCode: newReferralCode
			}, { transaction });

			if (referralCode) {
				const checkReferrer = await users.findOne({ where: { referralCode } });
				if (!checkReferrer) throw { message: "Referral code is not valid" };

				const referralVoucher = await vouchers.findOne({
					where: {
						name: { [Op.like]: `%Referral%` },
						availableFrom: { [Op.lte]: new Date(Date.now()) },
						validUntil: { [Op.gte]: new Date(Date.now()) }
					}
				});
				if (!referralVoucher) throw { message: "Referral voucher not found" }
				
				const checkVoucher = await user_vouchers.findOne({
					where: {
						VoucherId: referralVoucher.id,
						UserId: checkReferrer.id
					}
				});
				if (checkVoucher) await user_vouchers.update({
					amount: checkVoucher.amount + 1
				}, { where: { VoucherId: referralVoucher.id, UserId: checkReferrer.id }, transaction })
				else await user_vouchers.create({
					VoucherId: referralVoucher.id,
					UserId: checkReferrer.id,
					amount: 1
				}, { transaction });

				await user_vouchers.create({ VoucherId: referralVoucher.id, UserId: result.id, amount: 1 }, { transaction });
				await notifications.create({
					type: "Discount",
					name: "Referral Gift",
					description: `${username} has used your referral code to register.
					You've received a free shopping voucher. Keep sharing to get more coupons!`,
					UserId: checkReferrer.id
				}, { transaction });

				await notifications.create({
					type: "Discount",
					name: "Referral Gift",
					description: `You have used ${checkReferrer.username}'s referral code.
					You've received a free shopping voucher. Share your referral code to get more coupons!`,
					UserId: result.id
				}, { transaction })
			}

			const payload = { id: result.id };
			const token = jwt.sign(payload, process.env.KEY_JWT, { expiresIn: "1h" });
			const data = fs.readFileSync(path.join(__dirname, "../templates/templateVerification.html"), "utf-8"); 
			const tempCompile = handlebars.compile(data);
			const tempResult = tempCompile({ link: process.env.REACT_APP_BASE_URL, username, token });
			transporter.sendMail({
				from: process.env.NODEMAILER_USER,
				to: email,
				subject: "Verify Your AlphaMart Account",
				html: tempResult,
			});
			await transaction.commit();
			res.status(200).send({
				status: true,
				message: "Register successful. Please check your e-mail to verify.",
				result,
				token,
			});
		} catch (error) {
			await transaction.rollback();
			return res.status(500).send({
				error,
				status: 500,
				message: "Internal server error.",
			});
		}
	},
	verificationAccount: async (req, res) => {
		try {
			const isAccountExist = await users.findOne({
				where: {
					id: req.user.id,
				},
			});
			const isTokenExist = await tokenVerification.findOne({
				where: { token: req.token },
			});
			if (isAccountExist.isVerified) throw { message: "Account is already verified." };
			if (isTokenExist) throw { message: "Verification link is expired." };
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
			await tokenVerification.create({
				token: req.token,
			});
			res.status(200).send({
				message: "Verify success",
				result,
			});
		} catch (error) {
			return res.status(500).send({
				error,
				status: 500,
				message: "Internal server error.",
			});
		}
	},
	forgotPassword: async (req, res) => {
		try {
			const result = await users.findOne({ where: { email: req.body.email } });
			if (!result) throw { message: "Email not found" };

			const payload = { id: result.id };
			const token = jwt.sign(payload, process.env.KEY_JWT, { expiresIn: "1d" });

			const data = fs.readFileSync(path.join(__dirname, "../templates/resetPassword.html"), "utf-8"); 
			const tempCompile = handlebars.compile(data);
			const tempResult = tempCompile({ link: process.env.REACT_APP_BASE_URL, username: result.username, token });
			await transporter.sendMail({
				from: process.env.NODEMAILER_USER,
				to: req.body.email,
				subject: "Reset Your AlphaMart Account Password",
				html: tempResult,
			});

			res.status(200).send({
				status: true,
				message: "Reset password link sent. Please check your e-mail.",
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
	resetPassword: async (req, res) => {
		try {
			const isTokenExist = await tokenVerification.findOne({
				where: { token: req.token },
			});
			if (isTokenExist) throw { message: "Verification link is expired." };
			await tokenVerification.create({
				token: req.token,
			});
			const salt = await bcrypt.genSalt(10);
			const hashPassword = await bcrypt.hash(req.body.password, salt);
			users.update({ password: hashPassword }, { where: { id: req.user.id } });

			res.status(200).send({
				status: true,
				message: "Reset password successful.",
			});
		} catch (error) {
			return res.status(500).send({
				error,
				status: 500,
				message: "Internal server error.",
			});
		}
	},
	updateProfile: async (req, res) => {
		try {
			const { firstName, lastName, birthDate, gender } = req.body;
			const result = await users.update(
				{
					firstName,
					lastName,
					gender,
					birthDate,
				},
				{ where: { id: req.user.id } }
			);
			res.status(200).send({
				status: true,
				message: "Your profile is updated.",
				result,
			});
		} catch (error) {
			return res.status(500).send({
				error,
				status: 500,
				message: "Internal server error.",
			});
		}
	},
	updateEmail: async (req, res) => {
		try {
			const { currentEmail, email } = req.body;
			const isEmailexist = await users.findOne({
				where: { email },
			});
			const isAccountExist = await users.findOne({
				where: { id: req.user.id },
			});
			if (isAccountExist && isAccountExist.email !== currentEmail) throw { message: "Incorrect old e-mail." };
			if (isEmailexist && isEmailexist.email === email) throw { message: "E-mail has been used" };
			const result = await users.update({ email, isVerified: false }, { where: { id: isAccountExist.id } });
			const payload = { id: req.user.id };
			const token = jwt.sign(payload, process.env.KEY_JWT, { expiresIn: "1h" });
			const data = fs.readFileSync(path.join(__dirname, "../templates/templateVerification.html"), "utf-8"); 
			const tempCompile = handlebars.compile(data);
			const tempResult = tempCompile({
				link: process.env.REACT_APP_BASE_URL,
				username: isAccountExist.username,
				token,
			});
			transporter.sendMail({
				from: process.env.NODEMAILER_USER,
				to: email,
				subject: "Re-Verify Your AlphaMart Account",
				html: tempResult,
			});
			res.status(200).send({
				status: true,
				message: "Your e-mail has been updated. Please check your new e-mail address to re-verify your account.",
				result,
			});
		} catch (error) {
			return res.status(500).send({
				error,
				status: 500,
				message: "Internal server error.",
			});
		}
	},
	updatePhone: async (req, res) => {
		try {
			const { currentPhone, phone } = req.body;
			const isPhoneExist = await users.findOne({
				where: { phone },
			});
			const isAccountExist = await users.findOne({
				where: { id: req.user.id },
			});
			if (isAccountExist && isAccountExist.phone !== currentPhone) throw { message: "Incorrect old phone number." };
			if (isPhoneExist && isPhoneExist.phone === phone) throw { message: "Phone number has been used." };
			const result = await users.update({ phone }, { where: { id: isAccountExist.id } });
			res.status(200).send({
				status: true,
				message: "Your phone number has been updated.",
				result,
			});
		} catch (error) {
			return res.status(500).send({
				error,
				status: 500,
				message: "Internal server error.",
			});
		}
	},
	changePassword: async (req, res) => {
		try {
			const { currentPassword, password } = req.body;
			const isAccountExist = await users.findOne({
				where: { id: req.user.id },
			});
			const isValid = await bcrypt.compare(currentPassword, isAccountExist.password);
			if (!isValid) throw { message: "Incorrect current password" };
			if (currentPassword === password) throw { message: "New pasword must be different." };
			const salt = await bcrypt.genSalt(10);
			const hashPassword = await bcrypt.hash(password, salt);
			const result = await users.update({ password: hashPassword }, { where: { id: req.user.id } });
			res.status(200).send({ result, message: "Password has been changed" });
		} catch (error) {
			return res.status(500).send({
				error,
				status: 500,
				message: "Internal server error.",
			});
		}
	},
	updateAvatar: async (req, res) => {
		try {
			if (req.file == undefined) {
				throw { message: "Image should not be empty." };
			}
			const result = await users.update({ avatar: req.file.filename }, { where: { id: req.user.id } });
			const data = await users.findOne({ where: { id: req.user.id } });
			res.status(200).send({ result, message: "Your image profile has been changed", data });
		} catch (error) {
			return res.status(500).send({
				error,
				status: 500,
				message: "Internal server error.",
			});
		}
	},
	resendVerificationEmail: async (req, res) => {
		try {
			const result = await users.findOne({
				where: { id: req.user.id }
			});
			const payload = { id: result.id };
			const token = jwt.sign(payload, process.env.KEY_JWT, { expiresIn: "5m" });
			const data = fs.readFileSync(path.join(__dirname, "../templates/templateVerification.html"), "utf-8");
			const tempCompile = handlebars.compile(data);
			const tempResult = tempCompile({ link: process.env.REACT_APP_BASE_URL, username: result.username, token });
			await transporter.sendMail({
				from: process.env.NODEMAILER_USER,
				to: result.email,
				subject: "Verify Your AlphaMart Account",
				html: tempResult,
			});
			
			res.status(200).send({
				status: true,
				message: "Verification email sent. Link will expire in 5 minutes.",
				token,
			});
		} catch (err) {
			res.status(400).send(err);
		}
	},
};
