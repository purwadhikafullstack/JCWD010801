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
const { Sequelize } = require("sequelize");
const schedule = require("node-schedule");

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
			const result = await order_details.findAll({
				include: [{ model: orders }, { model: products, where: condition }],
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
			const { shipment, shipmentMethod, etd, shippingFee, tax, subtotal, total, discount } = req.body;
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
				await stocks.decrement(
					{
						currentStock: item.quantity,
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
			console.log(error)
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
    },
    userCancelOrder: async(req, res) => {
        const transaction = await db.sequelize.transaction();
        try {
            await orders.update({ status: "cancelled" }, { where: { id: req.params.id }, transaction });
            const ord = await orders.findOne({
                where: { id: req.params.id },
                include: { model: carts }
            });

            const result = await order_details.findAll({ where: { OrderId: req.params.id } });

            for (const {ProductId, quantity} of result) {
                let { currentStock } = await stocks.findOne({ where: { ProductId, BranchId: ord.Cart.BranchId } })
                await stocks.update({ currentStock: currentStock + quantity }, {
                    where: { ProductId, BranchId: ord.Cart.BranchId },
                    transaction
                })
            }

            await transaction.commit();

            res.status(200).send({
                status: true,
                message: "Order cancelled"
            });

        } catch (err) {
            await transaction.rollback();
            res.status(400).send(err);
        }
    },
    userAutoCancelOrder: async(req, res) => {
		const autoCancelTime = new Date(Date.now() + 300000);
		schedule.scheduleJob(autoCancelTime, async() => {
			const transaction = await db.sequelize.transaction();
			try {
				const ord = await orders.findOne({
					where: { id: req.params.id },
					include: { model: carts }
				});
				
				if (!ord.paymentProof) {
					await orders.update({ status: "cancelled" }, { where: { id: req.params.id }, transaction });
		
					const result = await order_details.findAll({ where: { OrderId: req.params.id } });
		
					for (const {ProductId, quantity} of result) {
						let { currentStock } = await stocks.findOne({ where: { ProductId, BranchId: ord.Cart.BranchId } })
						await stocks.update({ currentStock: currentStock + quantity }, {
							where: { ProductId, BranchId: ord.Cart.BranchId },
							transaction
						})
					}
		
					await transaction.commit();
		
					res.status(200).send({
						status: true,
						message: "Order cancelled"
					});
				}
	
			} catch (err) {
				await transaction.rollback();
				res.status(400).send(err);
			}
		});
    },
	getLatestId: async(req, res) => {
		try {
			const { id } = await orders.findOne({
				order: [[ Sequelize.col("id"), "DESC" ]]
			});
			res.status(200).send({
				status: true,
				latestId: id
			})
		} catch (err) {
			res.status(400).send(err);
		}
	}
};
