const db = require("../models");
const orders = db.Orders;
const order_details = db.Order_details;
const { Op, where } = require("sequelize");
const Axios = require("axios");
const qs = require("qs");
const carts = db.Carts;
const cartItems = db.Cart_items;
const products = db.Products;
const stocks = db.Stocks;
const { Sequelize } = require("sequelize");
const schedule = require("node-schedule");
const branches = db.Branches;
const addresses = db.Addresses;
const users = db.Users;

module.exports = {
	reportSuperAdmin: async (req, res) => {
		try {
			const page = +req.query.page || 1;
			const limit = req.query.limit !== undefined ? +req.query.limit : null;
			const search = req.query.search;
			const condition = { status: "Received" };
			const offset = (page - 1) * limit;
			const startDate = req.query.startDate;
			const endDate = req.query.endDate;
			const sort = req.query.sort || "desc";
			const searchUser = req.query.searchUser;
			const year = req.query.year;
			const month = req.query.month;
			const searchProduct = req.query.searchProduct;
			const searchBranch = req.query.searchBranch;
			if (year) {
				condition["createdAt"] = {
					[Op.between]: [`${year}-01-01`, `${year}-12-31`],
				};
			}

			if (year && month) {
				const numericYear = parseInt(year, 10);
				const numericMonth = parseInt(month, 10);

				if (!isNaN(numericYear) && !isNaN(numericMonth) && numericMonth >= 1 && numericMonth <= 12) {
					const startDate = new Date(numericYear, numericMonth - 1, 1);

					let endDate;
					if (numericMonth === 12) {
						endDate = new Date(numericYear, numericMonth, 0, 23, 59, 59, 999);
					} else {
						endDate = new Date(numericYear, numericMonth, 0, 23, 59, 59, 999);
					}

					condition["createdAt"] = {
						[Op.between]: [startDate, endDate],
					};
				}
			}
			if (search) {
				condition[Op.or] = [{ id: { [Op.like]: `%${search}%` } }];
			}
			const userCondition = {};
			if (searchUser) {
				userCondition["$username$"] = {
					[Op.like]: `%${searchUser}%`,
				};
			}
			const productCondition = {};
			if (searchProduct) {
				productCondition["$productName$"] = {
					[Op.like]: `%${searchProduct}%`,
				};
			}
			const branchCondition = {};
			if (searchBranch) {
				branchCondition.BranchId = searchBranch;
			}
			if (startDate && endDate) {
				const startOfDay = new Date(startDate);
				const endOfDay = new Date(endDate);
				endOfDay.setHours(23, 59, 59, 999);
				condition.createdAt = {
				  [Op.between]: [startOfDay, endOfDay],
				};
			  } else if (startDate) {
				const startOfDay = new Date(startDate);
				condition.createdAt = {
				  [Op.gte]: startOfDay,
				};
			  } else if (endDate) {
				const endOfDay = new Date(endDate);
				endOfDay.setHours(23, 59, 59, 999);
				condition.createdAt = {
				  [Op.lte]: endOfDay,
				};
			  }

			const total = await orders.count({
				where: condition,
			});

			const result = await orders.findAll({
				include: [
					{
						model: order_details,
						include: {
							model: products,
							where: productCondition,
						},
					},
					{
						model: carts,
						where: branchCondition,
						include: [
							{
								model: branches,
							},
						],
					},
					{
						model: addresses,
						include: [
							{
								model: users,
								where: userCondition,
							},
						],
					},
				],
				limit: limit !== null ? limit : undefined,
				offset: offset,
				order: [["createdAt", sort]],
				total,
				where: condition,
			});

			const groupedResults = result.reduce((acc, order) => {
				const year = new Date(order.createdAt).getFullYear();

				if (!acc[year]) {
					acc[year] = {
						orders: [],
						monthlyTotal: {},
						realTotal: 0,
					};
				}
				acc[year].orders.push(order);

				const month = new Date(order.createdAt).getMonth() + 1;
				if (!acc[year].monthlyTotal[month]) {
					acc[year].monthlyTotal[month] = 0;
				}
				acc[year].monthlyTotal[month] += order.total;
				acc[year].realTotal += order.total;

				return acc;
			}, {});

			let totalAllOrders = 0;

			for (const order of result) {
				totalAllOrders += order.total;
			}

			res.status(200).send({
				totalAllOrders,
				totalPage: limit ? Math.ceil(total / limit) : 1,
				currentpage: page,
				total_order: total,
				result,
				groupedResults,
			});
		} catch (error) {
			console.log(error);
			return res.status(500).send({
				error,
				status: 500,
				message: "Internal server error.",
			});
		}
	},
	reportProduct: async (req, res) => {
		try {
			const result = await order_details.findAll({
				attributes: [
					[Sequelize.literal("DISTINCT `OrderId`"), "OrderId"],
					// Include all other attributes you want here
					"ProductId",
					"quantity",
					// Add more attributes as needed
				],
				raw: true,
			});
			res.status(200).send({
				status: true,
				result,
			});
		} catch (error) {
			console.log(error);
			return res.status(500).send({
				error,
				status: 500,
				message: "Internal server error.",
			});
		}
	},
};
