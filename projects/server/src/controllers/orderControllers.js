const db = require("../models");
const orders = db.Orders;
const order_details = db.Order_details;
const { Op } = require("sequelize");
const Axios = require("axios");
const qs = require("qs");
const carts = db.Carts;
const cartItems = db.Cart_items;
const products = db.Products;
const categories = db.Categories;
const stocks = db.Stocks;
const branches = db.Branches;
const { Sequelize } = require("sequelize");

module.exports = {
	shipment: async (req, res) => {
		try {
			const { courier, origin, destination, weight } = req.body;
			let data = qs.stringify({
				origin: origin,
				destination: destination,
				weight: weight,
				courier: courier,
			});
			const config = {
				url: "https://api.rajaongkir.com/starter/cost",
				method: "post",
				headers: {
					key: process.env.KEY_RAJAONGKIR,
					"Content-Type": "application/x-www-form-urlencoded",
				},
				data: data,
			};
			try {
				const response = await Axios(config);
				res.status(200).send({
					status: true,
					data: response.data.rajaongkir.results[0],
				});
			} catch (error) {
				console.log(error);
				return res.status(500).send({
					error,
					status: 500,
					message: "Internal server error.",
				});
			}
		} catch (error) {
			console.log(error);
			return res.status(500).send({
				error,
				status: 500,
				message: "Internal server error.",
			});
		}
	},
	ordersList: async (req, res) => {
		try {
			const page = +req.query.page || 1;
			const limit = +req.query.limit || 4;
			const search = req.query.search;
			const date = req.query.date;
			const offset = (page - 1) * limit;
			const sort = req.query.sort || "DESC";
			const condition = {};
			if (search) {
				condition[Op.or] = [
					{
						productName: {
							[Op.like]: `%${search}%`,
						},
					},
				];
			}
			const whereCondition = {};
			if (date) {
				const startDate = new Date(date);
				startDate.setUTCHours(0, 0, 0, 0);
				const endDate = new Date(date);
				endDate.setUTCHours(23, 59, 59, 999);
				whereCondition.updatedAt = {
					[Op.and]: [{ [Op.gte]: startDate }, { [Op.lte]: endDate }],
				};
			}
			const result = await order_details.findAll({
				include: [
					{
						model: orders,
						include: [
							{
								model: carts,
								include: [
									{
										model: branches,
									},
								],
							},
						],
						where: whereCondition,
					},
					{ model: products, where: condition },
				],
				limit,
				offset,
				order: [[{ model: orders }, "updatedAt", sort]],
			});
			const filteredResult = result.filter((item) => item.Order.Cart.UserId === req.user.id);
			res.status(200).send({
				result: filteredResult,
				currentPage: page,
			});
		} catch (error) {
			return res.status(500).send({
				error,
				status: 500,
				message: "Internal server error.",
			});
		}
	},
	superAdminOrdersList: async (req, res) => {
		try {
			const page = +req.query.page || 1;
			const limit = +req.query.limit || 4;
			const search = req.query.search;
			const date = req.query.date;
			const offset = (page - 1) * limit;
			const sort = req.query.sort || "DESC";
			const condition = {};
			if (search) {
				condition[Op.or] = [
					{
						productName: {
							[Op.like]: `%${search}%`,
						},
					},
				];
			}
			const whereCondition = {};
			if (date) {
				const startDate = new Date(date);
				startDate.setUTCHours(0, 0, 0, 0);
				const endDate = new Date(date);
				endDate.setUTCHours(23, 59, 59, 999);
				whereCondition.updatedAt = {
					[Op.and]: [{ [Op.gte]: startDate }, { [Op.lte]: endDate }],
				};
			}
			const result = await order_details.findAll({
				include: [
					{
						model: orders,
						include: [
							{
								model: carts,
								include: [
									{
										model: branches,
									},
								],
							},
						],
						where: whereCondition,
					},
					{ model: products, where: condition },
				],
				limit,
				offset,
				order: [[{ model: orders }, "updatedAt", sort]],
			});
			res.status(200).send({
				result,
				currentPage: page,
			});
		} catch (error) {
			return res.status(500).send({
				error,
				status: 500,
				message: "Internal server error.",
			});
		}
	},
	branchAdminOrdersList: async (req, res) => {
		try {
			const page = +req.query.page || 1;
			const limit = +req.query.limit || 4;
			const search = req.query.search;
			const date = req.query.date;
			const offset = (page - 1) * limit;
			const condition = {};
			if (search) {
				condition[Op.or] = [
					{
						productName: {
							[Op.like]: `%${search}%`,
						},
					},
				];
			}
			const whereCondition = {};
			if (date) {
				const startDate = new Date(date);
				startDate.setUTCHours(0, 0, 0, 0);
				const endDate = new Date(date);
				endDate.setUTCHours(23, 59, 59, 999);
				whereCondition.updatedAt = {
					[Op.and]: [{ [Op.gte]: startDate }, { [Op.lte]: endDate }],
				};
			}
			const result = await order_details.findAll({
				include: [
					{
						model: orders,
						include: [
							{
								model: carts,
								include: [
									{
										model: branches,
									},
								],
								where: { BranchId: req.user.id },
							},
						],
						where: whereCondition,
					},
					{ model: products, where: condition },
				],
				limit,
				offset,
			});
			res.status(200).send({
				result,
				currentPage: page,
			});
		} catch (error) {
			return res.status(500).send({
				error,
				status: 500,
				message: "Internal server error.",
			});
		}
	},
	order: async (req, res) => {
		try {
			const cartCheckedOut = await carts.findOne({
				where: {
					id: req.params.id,
					UserId: req.user.id,
					status: "ACTIVE",
				},
			});
			const orderedItems = await cartItems.findAll({
				where: {
					CartId: cartCheckedOut.id,
				},
			});
			const result = await orders.create({
				courier,
				shipmentMethod,
				etd,
				shippingFee,
				subtotal,
				tax,
				total,
				status: "Waiting payment",
				CartId: cartCheckedOut.id,
			});
			await order_details.create({
				OrderId: result.id,
				ProductId: orderedItems.ProductId,
				quantity: orderedItems.quantity,
			});
			await carts.update(
				{
					status: "CHECKEDOUT",
				},
				{
					where: {
						id: cartCheckedOut.id,
					},
				}
			);
			res.status(200).send({
				status: true,
				message:
					"Your order has been successfully placed. Please promptly send your payment proof via bank transfer to the provided account. Your order will be processed upon receipt of your payment proof. Thank you!",
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
    uploadPaymentProof: async(req, res) => {
        try {
            const imgURL = req?.file?.filename;

            await orders.update({ paymentProof: imgURL, status: "Pending payment confirmation" }, { where: { id: req.params.id } });

            res.status(200).send({
                status: true,
                message: "Payment proof uploaded"
            });

        } catch (err) {
            res.status(400).send(err);
        }
    }
};
