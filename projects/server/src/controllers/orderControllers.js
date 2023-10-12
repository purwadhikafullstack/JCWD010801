const { Op } = require("sequelize");
const { Sequelize } = require("sequelize");
const Axios = require("axios");
const db = require("../models");
const transporter = require("../middlewares/transporter");
const fs = require("fs");
const qs = require("qs");
const handlebars = require("handlebars");
const schedule = require("node-schedule");
const orders = db.Orders;
const order_details = db.Order_details;
const carts = db.Carts;
const cartItems = db.Cart_items;
const products = db.Products;
const stocks = db.Stocks;
const branches = db.Branches;
const user_vouchers = db.User_vouchers;
const vouchers = db.Vouchers;
const addresses = db.Addresses;
const users = db.Users;
const stockMovements = db.StockMovements;
const notifications = db.Notifications;

function generateInvoiceNumber(userId) {
	const currentDate = new Date();
	const year = currentDate.getFullYear().toString().slice(-2);
	const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
	const day = currentDate.getDate().toString().padStart(2, "0");
	const hours = currentDate.getHours().toString().padStart(2, "0");
	const minutes = currentDate.getMinutes().toString().padStart(2, "0");
	const seconds = currentDate.getSeconds().toString().padStart(2, "0");
	const userIdPart = userId.toString().padStart(4, "0");
	const timestamp = `INV/${userIdPart}/APM/${year}${month}${day}${hours}${minutes}${seconds}`;
	return timestamp;
}

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
			const limit = +req.query.limit || 8;
			const search = req.query.search;
			const branchId = req.query.branchId;
			const startDate = req.query.startDate;
			const endDate = req.query.endDate;
			const status = req.query.status;
			const sort = req.query.sort || "DESC";
			const offset = (page - 1) * limit;
			const condition = {};
			const whereCondition = {};
			const branchCondition = {};
			if (search) {
				whereCondition[Op.or] = [
					{
						invoice: {
							[Op.like]: `%${search}%`,
						},
					},
				];
			}
			if (status) {
				whereCondition.status = status;
			}
			if (startDate && endDate) {
				const startOfDay = new Date(startDate);
				const endOfDay = new Date(endDate);
				endOfDay.setHours(23, 59, 59, 999);
				whereCondition.updatedAt = {
					[Op.between]: [startOfDay, endOfDay],
				};
			} else if (startDate) {
				const startOfDay = new Date(startDate);
				whereCondition.updatedAt = {
					[Op.gte]: startOfDay,
				};
			} else if (endDate) {
				const endOfDay = new Date(endDate);
				endOfDay.setHours(23, 59, 59, 999);
				whereCondition.updatedAt = {
					[Op.lte]: endOfDay,
				};
			}
			if (branchId) branchCondition["BranchId"] = branchId;
			const result = await orders.findAll({
				where: whereCondition,
				include: [
					{
						model: order_details,
						include: [
							{
								model: products,
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
						where: { UserId: req.user.id, ...branchCondition },
					},
					{
						model: addresses,
					},
				],
				limit,
				offset,
				order: [["updatedAt", sort]],
			});
			const countOrders = await orders.count({
				where: whereCondition,
				include: [
					{
						model: order_details,
						include: [
							{
								model: products,
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
						where: { UserId: req.user.id, ...branchCondition },
					},
					{
						model: addresses,
					},
				],
			});
			res.status(200).send({
				totalPage: Math.ceil(countOrders / limit),
				currentPage: page,
				countOrders,
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
	superAdminOrdersList: async (req, res) => {
		try {
			const page = +req.query.page || 1;
			const limit = +req.query.limit || 8;
			const search = req.query.search;
			const branchId = req.query.branchId;
			const searchName = req.query.searchName;
			const startDate = req.query.startDate;
			const endDate = req.query.endDate;
			const status = req.query.status;
			const sort = req.query.sort || "DESC";
			const offset = (page - 1) * limit;
			const searchCondition = {};
			const whereCondition = {};
			const branchCondition = {};
			if (search) {
				whereCondition[Op.or] = [
					{
						invoice: {
							[Op.like]: `%${search}%`,
						},
					},
				];
			}
			if (searchName) {
				searchCondition[Op.or] = [
					{
						username: {
							[Op.like]: `%${searchName}%`,
						},
					},
					{
						email: {
							[Op.like]: `%${searchName}%`,
						},
					},
					{
						firstName: {
							[Op.like]: `%${searchName}%`,
						},
					},
					{
						lastName: {
							[Op.like]: `%${searchName}%`,
						},
					},
				];
			}
			if (status) {
				whereCondition.status = status;
			}
			if (startDate && endDate) {
				const startOfDay = new Date(startDate);
				const endOfDay = new Date(endDate);
				endOfDay.setHours(23, 59, 59, 999);
				whereCondition.updatedAt = {
					[Op.between]: [startOfDay, endOfDay],
				};
			} else if (startDate) {
				const startOfDay = new Date(startDate);
				whereCondition.updatedAt = {
					[Op.gte]: startOfDay,
				};
			} else if (endDate) {
				const endOfDay = new Date(endDate);
				endOfDay.setHours(23, 59, 59, 999);
				whereCondition.updatedAt = {
					[Op.lte]: endOfDay,
				};
			}
			if (branchId) branchCondition["BranchId"] = branchId;
			const result = await orders.findAll({
				where: whereCondition,
				include: [
					{
						model: order_details,
						include: [
							{
								model: products,
							},
						],
					},
					{
						model: carts,
						include: [
							{
								model: branches,
							},
							{
								model: users,
								where: searchCondition,
							},
						],
						where: branchCondition,
					},
					{
						model: addresses,
					},
				],
				limit,
				offset,
				order: [["updatedAt", sort]],
			});
			const countOrders = await orders.count({
				where: whereCondition,
				include: [
					{
						model: order_details,
						include: [
							{
								model: products,
							},
						],
					},
					{
						model: carts,
						include: [
							{
								model: branches,
							},
							{
								model: users,
								where: searchCondition,
							},
						],
						where: branchCondition,
					},
					{
						model: addresses,
					},
				],
			});
			res.status(200).send({
				totalPage: Math.ceil(countOrders / limit),
				currentPage: page,
				countOrders,
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
	branchAdminOrdersList: async (req, res) => {
		try {
			const page = +req.query.page || 1;
			const limit = +req.query.limit || 8;
			const search = req.query.search;
			const searchName = req.query.searchName;
			const startDate = req.query.startDate;
			const endDate = req.query.endDate;
			const status = req.query.status;
			const sort = req.query.sort || "DESC";
			const offset = (page - 1) * limit;
			const condition = {};
			const whereCondition = {};
			if (search) {
				whereCondition[Op.or] = [
					{
						invoice: {
							[Op.like]: `%${search}%`,
						},
					},
				];
			}
			if (searchName) {
				condition[Op.or] = [
					{
						username: {
							[Op.like]: `%${searchName}%`,
						},
					},
					{
						email: {
							[Op.like]: `%${searchName}%`,
						},
					},
					{
						firstName: {
							[Op.like]: `%${searchName}%`,
						},
					},
					{
						lastName: {
							[Op.like]: `%${searchName}%`,
						},
					},
				];
			}
			if (status) {
				whereCondition.status = status;
			}

			if (startDate && endDate) {
				const startOfDay = new Date(startDate);
				const endOfDay = new Date(endDate);
				endOfDay.setHours(23, 59, 59, 999);
				whereCondition.updatedAt = {
					[Op.between]: [startOfDay, endOfDay],
				};
			} else if (startDate) {
				const startOfDay = new Date(startDate);
				whereCondition.updatedAt = {
					[Op.gte]: startOfDay,
				};
			} else if (endDate) {
				const endOfDay = new Date(endDate);
				endOfDay.setHours(23, 59, 59, 999);
				whereCondition.updatedAt = {
					[Op.lte]: endOfDay,
				};
			}
			const branchAdmin = await users.findOne({ where: req.user.id });
			const result = await orders.findAll({
				where: whereCondition,
				include: [
					{
						model: order_details,
						include: [
							{
								model: products,
							},
						],
					},
					{
						model: carts,
						include: [
							{
								model: branches,
							},
							{
								model: users,
								where: condition,
							},
						],
						where: {
							BranchId: branchAdmin.BranchId,
						},
					},
					{
						model: addresses,
					},
				],
				limit,
				offset,
				order: [["updatedAt", sort]],
			});
			const countOrders = await orders.count({
				include: {
					model: carts,
					where: {
						BranchId: branchAdmin.BranchId,
					},
				},
			});
			const waitingOrders = await orders.count({
				where: {
					status: "Waiting Payment",
				},
				include: {
					model: carts,
					where: {
						BranchId: branchAdmin.BranchId,
					},
				},
			});
			const pendingOrders = await orders.count({
				where: {
					status: "Pending payment confirmation",
				},
				include: {
					model: carts,
					where: {
						BranchId: branchAdmin.BranchId,
					},
				},
			});
			const processingOrders = await orders.count({
				where: {
					status: "Processing",
				},
				include: {
					model: carts,
					where: {
						BranchId: branchAdmin.BranchId,
					},
				},
			});
			const sentOrders = await orders.count({
				where: {
					status: "Sent",
				},
				include: {
					model: carts,
					where: {
						BranchId: branchAdmin.BranchId,
					},
				},
			});
			const receivedOrders = await orders.count({
				where: {
					status: "Received",
				},
				include: {
					model: carts,
					where: {
						BranchId: branchAdmin.BranchId,
					},
				},
			});
			const cancelledOrders = await orders.count({
				where: {
					status: "Cancelled",
				},
				include: {
					model: carts,
					where: {
						BranchId: branchAdmin.BranchId,
					},
				},
			});
			res.status(200).send({
				totalPage: Math.ceil(countOrders / limit),
				currentPage: page,
				countOrders,
				waitingOrders,
				pendingOrders,
				processingOrders,
				sentOrders,
				receivedOrders,
				cancelledOrders,
				result: result,
			});
		} catch (error) {
			return res.status(500).send({
				error,
				status: 500,
				message: "Internal server error.",
			});
		}
	},
	paymentConfirmation: async (req, res) => {
		const transaction = await db.sequelize.transaction();
		try {
			const orderId = req.params.id;
			const order = await orders.findOne({ where: { id: orderId }, include: [{ model: carts }] });
			if (!order) {
				return res.status(404).send({
					message: "Order not found",
				});
			}
			if (order.status !== "Pending payment confirmation") {
				return res.status(400).send({
					message: "Order cannot be updated to 'Processing'. Current status is not 'Pending payment confirmation'.",
				});
			}
			await orders.update({ status: "Processing", paymentProof: null }, { where: { id: orderId }, transaction });
			await notifications.create({
				type: "Transaction",
				name: "Payment Confirmation Accepted",
				description: `The payment for your order on 
				${new Date(order.createdAt)?.toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}
				has been confirmed. We are currently processing your order. Thank you for shopping with us!`,
				UserId: order.Cart.UserId
			}, { transaction })
			await transaction.commit();

			res.status(200).send({
				status: true,
				message: "Order updated to 'Processing' successfully",
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
	receiveConfirmation: async (req, res) => {
		try {
			const orderId = req.params.id;
			const order = await orders.findOne({ where: { id: orderId } });
			if (!order) {
				return res.status(404).send({
					message: "Order not found",
				});
			}
			if (order.status !== "Sent") {
				return res.status(400).send({
					message: "Order cannot be updated to 'Received'. Current status is not 'Sent'.",
				});
			}
			await orders.update({ status: "Received" }, { where: { id: orderId } });
			res.status(200).send({
				status: true,
				message: "Order updated to 'Received' successfully",
			});
		} catch (error) {
			return res.status(500).send({
				error,
				status: 500,
				message: "Internal server error.",
			});
		}
	},
	rejectPaymentProof: async (req, res) => {
		const transaction = await db.sequelize.transaction();
		try {
			const orderId = req.params.id;
			const order = await orders.findOne({
				where: { id: orderId },
				include: [
					{
						model: carts,
						include: [
							{
								model: users,
							},
						],
					},
				],
			});
			if (!order) {
				return res.status(404).send({
					message: "Order not found",
				});
			}
			if (order.status !== "Pending payment confirmation") {
				return res.status(400).send({
					message:
						"Order cannot be updated to 'Waiting payment'. Current status is not 'Pending payment confirmation'.",
				});
			}
			await orders.update({ status: "Waiting payment", paymentProof: null }, { where: { id: orderId }, transaction });
			await notifications.create({
				type: "Transaction",
				name: "Payment Confirmation Rejected",
				description: `The payment for your order on 
				${new Date(order.createdAt)?.toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}
				has been rejected. Please reupload your payment proof as soon as possible.
				If you don't do so in 3 days, your order will be automatically cancelled.`,
				UserId: order.Cart.UserId
			}, { transaction });
			await transaction.commit();

			const data = fs.readFileSync("./src/templates/rejectPaymentProof.html", "utf-8");
			const tempCompile = handlebars.compile(data);
			const tempResult = tempCompile({ link: process.env.REACT_APP_BASE_URL });
			transporter.sendMail({
				from: process.env.NODEMAILER_USER,
				to: order.Cart.User.email,
				subject: "Please Reupload Your Payment Proof",
				html: tempResult,
			});
			res.status(200).send({
				status: true,
				message: "Order updated to 'Rejected' successfully",
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
	processingToSent: async (req, res) => {
		const transaction = await db.sequelize.transaction();
		try {
			const orderId = req.params.id;
			const order = await orders.findOne({
				where: { id: orderId },
				include: [
					{
						model: carts,
						include: [
							{
								model: users,
							},
						],
					},
				],
			});
			if (!order) {
				return res.status(404).send({
					message: "Order not found",
				});
			}
			if (order.status !== "Processing") {
				return res.status(400).send({
					message: "Order cannot be updated to 'Sent'. Current status is not 'Processing'.",
				});
			}
			const userId = req.user.id;
			const invoiceNumber = generateInvoiceNumber(userId);
			await orders.update({ status: "Sent", invoice: invoiceNumber }, { where: { id: orderId }, transaction });

			// Auto confirm order 5 minutes
			// 604800000 = 7 days
			const autoConfirmTime = new Date(Date.now() + 300000);
			schedule.scheduleJob(autoConfirmTime, async () => {
				try {
					const ord = await orders.findOne(
						{
							where: { id: orderId },
						},
					);
					await orders.update({ status: "Received" }, { where: { id: ord.id } });
				} catch (err) {
					console.log(err)
				}
			});

			await notifications.create({
				type: "Transaction",
				name: "Order Ready",
				description: `Order ${invoiceNumber} is ready! Your order will be at your doorstep in around ${order.etd}. Please confirm if you have receive your order. This order will be automatically confirmed if you don't do so in 7 days. You can confirm your order on your profile page.If you did not receive your order, please contact our customer service as soon as possible. Thank you for shopping with us!`,
				UserId: order.Cart.UserId
			}, { transaction })
			await transaction.commit();
			
			const data = fs.readFileSync("./src/templates/sentOrder.html", "utf-8");
			const tempCompile = handlebars.compile(data);
			const tempResult = tempCompile({
				link: process.env.REACT_APP_BASE_URL,
				invoice: invoiceNumber,
				username: order.Cart.User.username,
			});
			transporter.sendMail({
				from: process.env.NODEMAILER_USER,
				to: order.Cart.User.email,
				subject: "We have sent out your order for delivery.",
				html: tempResult,
			});
			res.status(200).send({
				status: true,
				invoiceNumber: invoiceNumber,
				message: "Order updated to 'Sent' successfully",
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
	cancelOrderByAdmin: async (req, res) => {
		const transaction = await db.sequelize.transaction();
		try {
			const orderId = req.params.id;
			const { AID } = req.query;
			const order = await orders.findOne({
				where: { id: orderId },
				include: [
					{
						model: carts,
						include: [
							{
								model: users,
							},
						],
					},
				],
			});

			if (!order) {
				return res.status(404).send({
					message: "Order not found",
				});
			}

			if (order.status !== "Processing") {
				return res.status(400).send({
					message: "Order cannot be updated to 'Cancelled'. Current status is not 'Processing'.",
				});
			}

			await orders.update({ status: "Cancelled" }, { where: { id: orderId }, transaction });
			await notifications.create({
				type: "Transaction",
				name: "Order Cancelled",
				description: `Your order on 
				${new Date(order.createdAt)?.toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}
				has been cancelled. We're deeply sorry for not providing you the best customer experience. 
				We hope we can provide a better shopping experience for you in the future. Best regards, AlphaMart Team`,
				UserId: order.Cart.UserId
			}, { transaction })

			const data = fs.readFileSync("./src/templates/cancelOrderAdmin.html", "utf-8");
			const tempCompile = handlebars.compile(data);
			const tempResult = tempCompile({ link: process.env.REACT_APP_BASE_URL });
			transporter.sendMail({
				from: process.env.NODEMAILER_USER,
				to: order.Cart.User.email,
				subject: "Sorry, your order has been canceled by the admin.",
				html: tempResult,
			});

			const cartCheckedOut = await carts.findOne({
				where: {
					id: order.CartId,
					status: "CHECKEDOUT",
				},
			});

			const orderedItems = await cartItems.findAll({
				where: {
					CartId: order.CartId,
				},
			});

			const stocksPromises = orderedItems.map(async (item) => {
				const product = await products.findOne({
					where: {
						id: item.ProductId,
					},
				});

				await product.increment(
					{
						aggregateStock: parseInt(item.quantity),
					},
					{
						where: {
							id: item.ProductId,
						},
						transaction
					}
				);

				const oldBranchStock = await stocks.findOne({
					where: {
						ProductId: item.ProductId,
						BranchId: cartCheckedOut.BranchId,
					},
				});

				const newBranchStock = parseInt(oldBranchStock.currentStock) + parseInt(item.quantity);

				await stockMovements.create({
					ProductId: item.ProductId,
					BranchId: cartCheckedOut.BranchId,
					oldValue: oldBranchStock.currentStock,
					newValue: parseInt(newBranchStock),
					change: parseInt(item.quantity),
					isAddition: true,
					isAdjustment: false,
					isInitialization: false,
					isBranchInitialization: false,
					UserId: AID,
				}, { transaction });

				await stocks.increment(
					{
						currentStock: parseInt(item.quantity),
					},
					{
						where: {
							ProductId: item.ProductId,
							BranchId: cartCheckedOut.BranchId,
						},
						transaction
					}
				);
			});
			await Promise.all(stocksPromises);

			await transaction.commit();
			res.status(200).send({
				status: true,
				message: "Order updated to 'Cancelled' successfully",
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
	order: async (req, res) => {
		const transaction = await db.sequelize.transaction();
		try {
			const { shipment, shipmentMethod, etd, shippingFee, tax, subtotal, total, discount, AddressId, VoucherId } =
				req.body;

			// Use voucher
			const filter = {
				where: {
					UserId: req.user.id,
					VoucherId,
				},
				transaction,
			};
			if (VoucherId) {
				const voucherCheck = await user_vouchers.findOne(filter);
				if (!voucherCheck.amount) return res.status(400).send({ status: false, message: "You are out of voucher" });
				const voucherTypeCheck = await vouchers.findOne({ where: { id: VoucherId } });
				if (voucherTypeCheck.minimumPayment > subtotal)
					return res.status(400).send({ status: false, message: "Minimum transaction has not been reached" });
				await user_vouchers.update({ amount: voucherCheck.amount - 1 }, filter);
			}

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

			const result = await orders.create(
				{
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
				},
				transaction
			);
			const orderDetailPromises = orderedItems.map(async (item) => {
				await order_details.create(
					{
						OrderId: result.id,
						ProductId: item.ProductId,
						quantity: item.quantity,
					},
					{ transaction }
				);
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
						aggregateStock: parseInt(item.quantity, 10),
					},
					{
						where: {
							id: item.ProductId,
						},
						transaction,
					}
				);

				const oldBranchStock = await stocks.findOne({
					where: {
						ProductId: item.ProductId,
						BranchId: cartCheckedOut.BranchId,
					},
				});

				const newBranchStock = parseInt(oldBranchStock.currentStock, 10) - parseInt(item.quantity, 10);

				await stockMovements.create(
					{
						ProductId: item.ProductId,
						BranchId: cartCheckedOut.BranchId,
						oldValue: oldBranchStock.currentStock,
						newValue: parseInt(newBranchStock, 10),
						change: -parseInt(item.quantity, 10),
						isAddition: false,
						isAdjustment: false,
						isInitialization: false,
						isBranchInitialization: false,
						UserId: req.user.id,
					},
					{ transaction }
				);

				await stocks.decrement(
					{
						currentStock: parseInt(item.quantity, 10),
					},
					{
						where: {
							ProductId: item.ProductId,
							BranchId: cartCheckedOut.BranchId,
						},
						transaction,
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
					transaction,
				}
			);

			// Auto cancel order 5 minutes
			const autoCancelTime = new Date(Date.now() + 60000);
			schedule.scheduleJob(autoCancelTime, async () => {
				const transaction = await db.sequelize.transaction();
				try {
					const ord = await orders.findOne(
						{
							where: { id: result.id },
							include: { model: carts },
						},
						{ transaction }
					);

					if (!ord.paymentProof) {
						await orders.update({ status: "Cancelled" }, { where: { id: ord.id }, transaction });

						const result = await order_details.findAll({ where: { OrderId: ord.id } });

						for (const { ProductId, quantity } of result) {
							let { currentStock } = await stocks.findOne({ where: { ProductId, BranchId: ord.Cart.BranchId } });
							const product = await products.findOne({
								where: {
									id: ProductId,
								},
							});

							await product.increment(
								{
									aggregateStock: parseInt(quantity, 10),
								},
								{
									where: {
										id: ProductId,
									},
									transaction,
								}
							);

							const newBranchStock = parseInt(currentStock, 10) + parseInt(quantity, 10);

							await stockMovements.create(
								{
									ProductId: ProductId,
									BranchId: ord.Cart.BranchId,
									oldValue: currentStock,
									newValue: parseInt(newBranchStock, 10),
									change: parseInt(quantity, 10),
									isAddition: true,
									isAdjustment: false,
									isInitialization: false,
									isBranchInitialization: false,
									UserId: ord.Cart.UserId,
								},
								{ transaction }
							);

							await stocks.increment(
								{
									currentStock: parseInt(quantity, 10),
								},
								{
									where: {
										ProductId,
										BranchId: ord.Cart.BranchId,
									},
									transaction,
								}
							);
						}
					}
					await transaction.commit();
				} catch (err) {
					await transaction.rollback();
				}
			});

			await transaction.commit();

			res.status(200).send({
				status: true,
				message:
					"Your order has been successfully placed. Please promptly send your payment proof via bank transfer to the provided account. Your order will be processed upon receipt of your payment proof. Thank you!",
				result,
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
				const product = await products.findOne({
					where: {
						id: ProductId,
					},
				});

				await product.increment(
					{
						aggregateStock: parseInt(quantity, 10),
					},
					{
						where: {
							id: ProductId,
						},
						transaction,
					}
				);

				const newBranchStock = parseInt(currentStock, 10) + parseInt(quantity, 10);

				await stockMovements.create(
					{
						ProductId: ProductId,
						BranchId: ord.Cart.BranchId,
						oldValue: currentStock,
						newValue: parseInt(newBranchStock, 10),
						change: parseInt(quantity, 10),
						isAddition: true,
						isAdjustment: false,
						isInitialization: false,
						isBranchInitialization: false,
						UserId: ord.Cart.UserId,
					},
					{ transaction }
				);

				await stocks.increment(
					{
						currentStock: parseInt(quantity, 10),
					},
					{
						where: {
							ProductId,
							BranchId: ord.Cart.BranchId,
						},
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
			const result = userAddress
				.sort((a, b) => (a.isMain === b.isMain ? 0 : a.isMain ? -1 : 1))
				.filter(
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
		} catch (err) {
			return res.status(500).send({
				error,
				status: 500,
				message: "Internal server error.",
			});
		}
	},
};
