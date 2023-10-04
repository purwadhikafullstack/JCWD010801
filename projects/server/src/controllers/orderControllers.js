const { Op } = require("sequelize");
const { Sequelize } = require("sequelize");
const Axios = require("axios");
const db = require("../models");
const qs = require("qs");
const schedule = require("node-schedule");
const orders = db.Orders;
const order_details = db.Order_details;
const carts = db.Carts;
const cartItems = db.Cart_items;
const products = db.Products;
const stocks = db.Stocks;
const branches = db.Branches;
const addresses = db.Addresses;
const stockMovements = db.StockMovements;

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
				return res.status(500).send({
					error,
					status: 500,
					message: "Internal server error.",
				});
			}
		} catch (error) {
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
			const status = req.query.status;
			const sort = req.query.sort || "DESC";
			const offset = (page - 1) * limit;
			const condition = {};
			const whereCondition = {};
			if (search) {
				condition[Op.or] = [
					{
						productName: {
							[Op.like]: `%${search}%`,
						},
					},
				];
			}
			if (status) {
				whereCondition.status = status;
			}
			if (date) {
				const startDate = new Date(date);
				startDate.setUTCHours(0, 0, 0, 0);
				const endDate = new Date(date);
				endDate.setUTCHours(23, 59, 59, 999);
				whereCondition.updatedAt = {
					[Op.and]: [{ [Op.gte]: startDate }, { [Op.lte]: endDate }],
				};
			}
			const result = await orders.findAll({
				include: [
					{
						model: order_details,
						include: [
							{
								model: products,
								where: condition,
							},
						],
					},
					{
						model: carts,
						include: [
							{
								model: branches,
							},
						],
					},
				],
				limit,
				offset,
				order: [["updatedAt", sort]],
				where: whereCondition,
			});
			const filteredResult = result.filter((item) => item.Cart.UserId === req.user.id);
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
			const branchId = req.query.branchId;
			const status = req.query.status;
			const sort = req.query.sort || "DESC";
			const offset = (page - 1) * limit;
			const condition = {};
			const whereCondition = {};
			const branchCondition = {};
			if (search) {
				condition[Op.or] = [
					{
						productName: {
							[Op.like]: `%${search}%`,
						},
					},
				];
			}
			if (status) {
				whereCondition.status = status;
			}
			if (date) {
				const startDate = new Date(date);
				startDate.setUTCHours(0, 0, 0, 0);
				const endDate = new Date(date);
				endDate.setUTCHours(23, 59, 59, 999);
				whereCondition.updatedAt = {
					[Op.and]: [{ [Op.gte]: startDate }, { [Op.lte]: endDate }],
				};
			}
			if (branchId) branchCondition["BranchId"] = branchId;
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
								where: branchCondition,
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
			const { shipment, shipmentMethod, etd, shippingFee, tax, subtotal, total, discount, AddressId } = req.body;
			const cartCheckedOut = await carts.findOne({
				where: {
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
				shipment,
				shipmentMethod,
				etd,
				shippingFee,
				subtotal,
				tax,
				total,
				discount,
				status: "Waiting payment",
				CartId: cartCheckedOut.id,
				AddressId: AddressId,
			});

			const orderDetailPromises = orderedItems.map(async (item) => {
				await order_details.create({
					OrderId: result.id,
					ProductId: item.ProductId,
					quantity: item.quantity,
				});
			});
			await Promise.all(orderDetailPromises);

			const stocksPromises = orderedItems.map(async (item) => {
				const product = await products.findOne({
					where: {
						id: item.ProductId,
					},
				});

				await product.decrement(
					{
						aggregateStock: parseInt(item.quantity),
					},
					{
						where: {
							id: item.ProductId,
						},
					}
				);

				const oldBranchStock = await stocks.findOne({
					where: {
						ProductId: item.ProductId,
						BranchId: cartCheckedOut.BranchId,
					}
				})

				const newBranchStock = parseInt(oldBranchStock.currentStock) - parseInt(item.quantity);

				await stockMovements.create({
					ProductId: item.ProductId,
					BranchId: cartCheckedOut.BranchId,
					oldValue: oldBranchStock.currentStock,
					newValue: parseInt(newBranchStock),
					change: -parseInt(item.quantity),
					isAddition: false,
					isAdjustment: false,
					isInitialization: false,
					isBranchInitialization: false,
					UserId: req.user.id,
				});

				await stocks.decrement(
					{
						currentStock: parseInt(item.quantity),
					},
					{
						where: {
							ProductId: item.ProductId,
							BranchId: cartCheckedOut.BranchId,
						},
					}
				);
			});
			await Promise.all(stocksPromises);

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
			console.log(error);
			return res.status(500).send({
				error,
				status: 500,
				message: "Internal server error.",
			});
		}
	},
	uploadPaymentProof: async (req, res) => {
		try {
			const imgURL = req?.file?.filename;

			await orders.update(
				{ paymentProof: imgURL, status: "Pending payment confirmation" },
				{ where: { id: req.params.id } }
			);

			res.status(200).send({
				status: true,
				message: "Payment proof uploaded",
			});
		} catch (err) {
			return res.status(500).send({
				err,
				status: 500,
				message: "Internal server error.",
			});
		}
	},
	userCancelOrder: async (req, res) => {
		const transaction = await db.sequelize.transaction();
		try {
			await orders.update({ status: "cancelled" }, { where: { id: req.params.id }, transaction });
			const ord = await orders.findOne({
				where: { id: req.params.id },
				include: { model: carts },
			});

			const result = await order_details.findAll({ where: { OrderId: req.params.id } });

			for (const { ProductId, quantity } of result) {
				let { currentStock } = await stocks.findOne({ where: { ProductId, BranchId: ord.Cart.BranchId } });
				await stocks.update(
					{ currentStock: currentStock + quantity },
					{
						where: { ProductId, BranchId: ord.Cart.BranchId },
						transaction,
					}
				);
			}

			await transaction.commit();

			res.status(200).send({
				status: true,
				message: "Order cancelled",
			});
		} catch (err) {
			await transaction.rollback();
			return res.status(500).send({
				err,
				status: 500,
				message: "Internal server error.",
			});
		}
	},
	userAutoCancelOrder: async (req, res) => {
		const autoCancelTime = new Date(Date.now() + 300000);
		schedule.scheduleJob(autoCancelTime, async () => {
			const transaction = await db.sequelize.transaction();
			try {
				const ord = await orders.findOne({
					where: { id: req.params.id },
					include: { model: carts },
				});

				if (!ord.paymentProof) {
					await orders.update({ status: "cancelled" }, { where: { id: req.params.id }, transaction });

					const result = await order_details.findAll({ where: { OrderId: req.params.id } });

					for (const { ProductId, quantity } of result) {
						let { currentStock } = await stocks.findOne({ where: { ProductId, BranchId: ord.Cart.BranchId } });
						await stocks.update(
							{ currentStock: currentStock + quantity },
							{
								where: { ProductId, BranchId: ord.Cart.BranchId },
								transaction,
							}
						);
					}

					await transaction.commit();

					res.status(200).send({
						status: true,
						message: "Order cancelled",
					});
				}
			} catch (err) {
				await transaction.rollback();
				return res.status(500).send({
					err,
					status: 500,
					message: "Internal server error.",
				});
			}
		});
	},
	getLatestId: async (req, res) => {
		try {
			const { id } = await orders.findOne({
				order: [[Sequelize.col("id"), "DESC"]],
			});
			res.status(200).send({
				status: true,
				latestId: id,
			});
		} catch (err) {
			return res.status(500).send({
				err,
				status: 500,
				message: "Internal server error.",
			});
		}
	},
	userConfirmOrder: async (req, res) => {
		try {
			await orders.update({ status: "Confirmed" }, { where: { id: req.params.id } });

			res.status(200).send({
				status: true,
				message: "Order confirmed",
			});
		} catch (err) {
			return res.status(500).send({
				err,
				status: 500,
				message: "Internal server error.",
			});
		}
	},
	userAutoConfirmOrder: async (req, res) => {
		const autoConfirmTime = new Date(Date.now() + 604800000);
		schedule.scheduleJob(autoConfirmTime, async () => {
			try {
				const ord = await orders.findOne({
					where: { id: req.params.id },
					include: { model: carts },
				});

				if (ord.status === "Sent") {
					await orders.update({ status: "Confirmed" }, { where: { id: req.params.id } });

					res.status(200).send({
						status: true,
						message: "Order confirmed",
					});
				}
			} catch (err) {
				return res.status(500).send({
					err,
					status: 500,
					message: "Internal server error.",
				});
			}
		});
	},
	address: async (req, res) => {
		try {
			const cartCheckedOut = await carts.findOne({
				where: {
					UserId: req.user.id,
					status: "ACTIVE",
				},
				include: { model: branches },
			});
			const userAddress = await addresses.findAll({
				where: {
					UserId: req.user.id,
				},
			});
			const result = userAddress.filter(
				(item) =>
					item.lat <= cartCheckedOut.Branch.northeast_lat &&
					item.lat >= cartCheckedOut.Branch.southwest_lat &&
					item.lng <= cartCheckedOut.Branch.northeast_lng &&
					item.lng >= cartCheckedOut.Branch.southwest_lng
			);

			res.status(200).send({
				status: true,
				result,
			});
		} catch (error) {
			return res.status(500).send({
				err,
				status: 500,
				message: "Internal server error.",
			});
		}
	},
};
