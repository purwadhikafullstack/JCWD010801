const { Sequelize } = require("sequelize");
const db = require("../models");
const { sequelize } = require("../models");
const carts = db.Carts;
const cartItems = db.Cart_items;
const products = db.Products;
const categories = db.Categories;
const stocks = db.Stocks;

module.exports = {
	addToCart: async (req, res) => {
		const transaction = await sequelize.transaction();
		try {
			const { ProductId, quantity, BranchId } = req.body;

			const checkBranch = await carts.findOne({
				where: {
					UserId: req.user.id,
					status: "ACTIVE",
				},
			});

			if (checkBranch?.BranchId !== +BranchId && checkBranch) return res.status(200).send({ status: "Switched" });

			const [result] = await carts.findOrCreate({
				where: {
					UserId: req.user.id,
					status: "ACTIVE",
					BranchId,
				},
				transaction,
			});

			const cart_item = await cartItems.findOne({
				where: {
					CartId: result.id,
					ProductId,
				},
			});

			// Update product quantity in cart
			if (cart_item)
				await cartItems.update(
					{ quantity: cart_item.quantity + quantity },
					{
						where: {
							CartId: result.id,
							ProductId,
						},
						transaction,
					}
				);
			else
				await cartItems.create(
					{
						CartId: result.id,
						ProductId,
						quantity,
					},
					{ transaction }
				);

			await transaction.commit();

			res.status(201).send({
				status: true,
				message: "Product added to cart",
			});
		} catch (err) {
			await transaction.rollback();
			res.status(400).send(err);
		}
	},
	getCartItems: async (req, res) => {
		try {
			const result = await carts.findOne({
				where: {
					UserId: req.user.id,
					status: "ACTIVE",
				},
			});
			if (!result) throw { state: false, message: "Cart not found" };

			const filter = {
				where: { CartId: result.id },
				include: {
					model: products,
					attributes: { exclude: ["isDeleted", "createdAt", "updatedAt"] },
					include: [
						{
							model: categories,
							attributes: { exclude: ["isDeleted"] },
						},
						{
							model: stocks,
							where: { BranchId: result.BranchId },
						},
					],
				},
				attributes: { exclude: ["isDeleted"] },
				order: [[Sequelize.col("createdAt"), `DESC`]],
			};

			// const stockResult = await stocks.findAll({
			//     where: {
			//         productId,
			//         BranchId: result.BRanchId
			//     }
			// })

			const cart_items = await cartItems.findAll(filter);
			const total = await cartItems.count(filter);
			const subtotal = await cartItems.findAll({
				where: { CartId: result.id },
				include: [
					{
						model: products,
						attributes: [],
					},
				],
				attributes: [
					[
						Sequelize.literal(`(
                            SELECT sum((Cart_items.quantity * Product.price))
                        )`),
						`subtotal`,
					],
				],
			});

			res.status(200).send({
				status: true,
				total,
				subtotal,
				cart: result,
				cart_items,
			});
		} catch (err) {
			res.status(404).send(err);
		}
	},
	switchBranch: async (req, res) => {
		const transaction = await sequelize.transaction();
		try {
			await carts.update(
				{
					status: "ABANDONED",
					description: "Switched branch",
				},
				{
					where: {
						UserId: req.user.id,
						status: "ACTIVE",
					},
					transaction,
				}
			);

			await carts.create(
				{
					UserId: req.user.id,
					status: "ACTIVE",
					BranchId: req.body.BranchId,
				},
				{ transaction }
			);

			await transaction.commit();

			res.status(200).send({
				status: true,
				message: "Cart abandoned",
			});
		} catch (err) {
			await transaction.rollback();
			res.status(400).send(err);
		}
	},
	updateQuantity: async (req, res) => {
		try {
			const { ProductId, quantity } = req.body;

			const result = await carts.findOne({
				where: {
					UserId: req.user.id,
					status: "ACTIVE",
				},
			});

			const productStock = await stocks.findOne({
				where: {
					productId: ProductId,
					BranchId: result.BranchId,
				},
			});
			if (productStock.currentStock - quantity < 0) throw { message: "Product out of stock" };
			if (quantity < 1) throw { message: "Minimum item 1" };

			await cartItems.update(
				{ quantity },
				{
					where: {
						CartId: result.id,
						ProductId,
					},
				}
			);

			res.status(200).send({
				status: true,
				message: "Item quantity updated",
			});
		} catch (err) {
			res.status(400).send(err);
		}
	},
	removeItem: async (req, res) => {
		try {
			const { id } = req.params;
			const result = await carts.findOne({
				where: {
					UserId: req.user.id,
					status: "ACTIVE",
				},
			});

			await cartItems.destroy({
				where: {
					CartId: result.id,
					ProductId: id,
				},
			});

			res.status(200).send({
				status: true,
				message: "Item removed from cart",
			});
		} catch (err) {
			res.status(400).send(err);
		}
	},
	clearCart: async (req, res) => {
		try {
			const { description } = req.body;

			await carts.update(
				{
					status: "ABANDONED",
					description,
				},
				{
					where: {
						UserId: req.user.id,
						status: "ACTIVE",
					},
				}
			);

			res.status(200).send({
				status: true,
				message: "Item removed from cart",
			});
		} catch (err) {
			res.status(400).send(err);
		}
	},
};
