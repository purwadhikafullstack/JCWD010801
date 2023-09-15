const db = require("../models");
const { sequelize } = require("../models");
const carts = db.Carts;
const cartItems = db.Cart_items;
const products = db.Products;
const categories = db.Categories;

module.exports = {
	createCart: async (req, res) => {
		try {
			const [result] = await carts.findOrCreate({
				where: {
					UserId: req.user.id,
					status: "CART",
				},
			});

			if (result)
				res.status(200).send({
					status: true,
					message: "Cart available",
				});
			else
				res.status(201).send({
					status: true,
					message: "Cart created",
				});
		} catch (err) {
			res.status(400).send(err);
		}
	},
	addToCart: async (req, res) => {
		const transaction = await sequelize.transaction();
		try {
			const { ProductId, quantity } = req.body;
			const [result] = await carts.findOrCreate({
				where: {
					UserId: req.user.id,
					status: "CART",
				},
				transaction,
			});

			const product_item = await products.findOne({ where: { id: ProductId } });
			if (product_item.aggregateStock < 1) throw { status: false, message: "Product out of stock" };

			const cart_item = await cartItems.findOne({
				where: {
					CartId: result.id,
					ProductId,
				},
				transaction,
			});

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

			await products.update({ aggregateStock: aggregateStock - quantity }, transaction);

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
					status: "CART",
				},
			});
			if (!result) throw { status: false, message: "Cart not found" };

			const cart_items = await cartItems.findAll(
				{
					where: {
						CartId: result.id,
					},
				},
				{
					include: [
						{
							name: products,
							exclude: ["isDeleted"],
							include: [{ name: categories }],
						},
					],
					exclude: ["isDeleted"],
				}
			);

			res.status(200).send({
				status: true,
				cart_items,
			});
		} catch (err) {
			res.status(404).send(err);
		}
	},
};
