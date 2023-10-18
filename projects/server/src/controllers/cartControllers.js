const { Sequelize, Op } = require("sequelize");
const db = require("../models");
const { sequelize } = require("../models");
const carts = db.Carts;
const cartItems = db.Cart_items;
const products = db.Products;
const categories = db.Categories;
const stocks = db.Stocks;
const branches = db.Branches;
const discounts = db.Discounts;

module.exports = {
	addToCart: async (req, res) => {
		const transaction = await sequelize.transaction();
		try {
			let { ProductId, quantity, BranchId } = req.body;

			const checkBranch = await carts.findOne({
				where: {
					UserId: req.user.id,
					status: "ACTIVE",
				},
			});

			if (checkBranch?.BranchId !== +BranchId && checkBranch) return res.status(200).send({ status: "Switched" });

			const checkProduct = await products.findOne({
				where: {
					id: ProductId,
				},
				include: [
					{
						model: stocks,
						where: { BranchId: parseInt(BranchId) || 1 },
						required: false,
					},
					{
						model: discounts,
						where: {
							BranchId: parseInt(BranchId) || 1,
							availableFrom: { [Op.lte]: new Date(Date.now()) },
							validUntil: { [Op.gte]: new Date(Date.now()) },
							isActive: true,
						},
						separate: true,
					},
				],
			});

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

			if (!cart_item) {
				if (quantity > checkProduct?.Stocks[0]?.currentStock / 2 && checkProduct?.Discounts[0]?.type === "Extra") {
					quantity = checkProduct?.Stocks[0]?.currentStock;
				} else if (quantity > checkProduct?.Stocks[0]?.currentStock) {
					quantity = checkProduct?.Stocks[0]?.currentStock;
				}
				await cartItems.create(
					{
						CartId: result.id,
						ProductId,
						quantity,
					},
					{ transaction }
				);
			} else if (
				cart_item.quantity > checkProduct?.Stocks[0]?.currentStock / 2 &&
				checkProduct?.Discounts[0]?.type === "Extra"
			) {
				if ((checkProduct?.Stocks[0]?.currentStock / 2) % 2 === 1) {
					await cartItems.update(
						{ quantity: checkProduct?.Stocks[0]?.currentStock / 2 + 1 },
						{
							where: {
								CartId: result.id,
								ProductId,
							},
							transaction,
						}
					);
				} else {
					await cartItems.update(
						{ quantity: checkProduct?.Stocks[0]?.currentStock / 2 },
						{
							where: {
								CartId: result.id,
								ProductId,
							},
							transaction,
						}
					);
				}
			} else if (cart_item.quantity >= checkProduct?.Stocks[0]?.currentStock) {
				await cartItems.update(
					{ quantity: checkProduct?.Stocks[0]?.currentStock },
					{
						where: {
							CartId: result.id,
							ProductId,
						},
						transaction,
					}
				);

				await transaction.commit();

				return res.status(400).send({
					status: "Exceed",
					message: `You are trying to add ${quantity} ${checkProduct.productName} into your cart. You already have ${cart_item.quantity} units in your cart and only ${checkProduct?.Stocks[0]?.currentStock} units are available.`,
					checkProduct,
				});
			} else if (cart_item) {
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
			}

			await transaction.commit();

			res.status(201).send({
				status: true,
				message: "Product added to cart",
				checkProduct,
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
				include: { model: branches },
			});

			if (!result)
				res.status(404).send({
					status: false,
					message: "Cart not found",
				});
			else {
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
							{
								model: discounts,
								where: {
									BranchId: result.BranchId,
									availableFrom: { [Op.lte]: new Date(Date.now()) },
									validUntil: { [Op.gte]: new Date(Date.now()) },
									isActive: true,
								},
								separate: true,
							},
						],
					},
					attributes: { exclude: ["isDeleted"] },
					order: [[Sequelize.col("createdAt"), `DESC`]],
				};

				const cart_items = await cartItems.findAll(filter);
				for (const { Product, CartId, ProductId, quantity } of cart_items) {
					if (quantity > Product.Stocks[0]?.currentStock)
						await cartItems.update(
							{ quantity: Product.Stocks[0]?.currentStock },
							{
								where: {
									CartId,
									ProductId,
								},
							}
						);
				}
				const total = await cartItems.count(filter);

				let subtotal = 0;
				for (let { Product, quantity } of cart_items) {
					if (
						Product?.Discounts[0]?.type === "Extra" &&
						quantity % 2 === 1 &&
						Product?.Stocks[0]?.currentStock === quantity
					)
						quantity = quantity / 2 + 0.5;
					else if (Product?.Discounts[0]?.type === "Extra" && quantity % 2 === 1) quantity = quantity / 2;
					else if (Product?.Discounts[0]?.type === "Extra" && quantity % 2 === 0) quantity = quantity / 2;
					subtotal = subtotal + quantity * Product.price;
				}

				res.status(200).send({
					status: true,
					total,
					subtotal: [{ subtotal }],
					cart: result,
					cart_items,
				});
			}
		} catch (err) {
			res.status(500).send({
				status: false,
				message: "Internal server error",
			});
		}
	},
	switchBranch: async (req, res) => {
		const transaction = await sequelize.transaction();
		try {
			const cart = await carts.findOne({
				where: {
					UserId: req.user.id,
					status: "ACTIVE",
				},
			});

			await cartItems.destroy({
				where: { CartId: cart.id },
				transaction,
			});

			await carts.update(
				{ BranchId: req.body.BranchId },
				{
					where: {
						id: cart.id,
					},
					transaction,
				}
			);

			await transaction.commit();

			res.status(200).send({
				status: true,
				message: "Cart switched branch",
			});
		} catch (err) {
			await transaction.rollback();
			res.status(400).send(err);
		}
	},
	updateQuantity: async (req, res) => {
		try {
			const { ProductId, quantity, BranchId } = req.body;

			const result = await carts.findOne({
				where: {
					UserId: req.user.id,
					status: "ACTIVE",
				},
			});

			const checkProduct = await products.findOne({
				where: {
					id: ProductId,
				},
				include: [
					{
						model: stocks,
						where: { BranchId: parseInt(BranchId) || 1 },
						required: false,
					},
					{
						model: discounts,
						where: {
							BranchId: parseInt(BranchId) || 1,
							availableFrom: { [Op.lte]: new Date(Date.now()) },
							validUntil: { [Op.gte]: new Date(Date.now()) },
							isActive: true,
						},
						separate: true,
					},
				],
			});
			if (checkProduct?.Discounts[0].type === "Extra" && quantity > checkProduct?.Stocks[0].currentStock + 0.5) {
				let maxStock = checkProduct?.Stocks[0].currentStock;
				if (checkProduct?.Stocks[0].currentStock % 2 === 1) maxStock = checkProduct?.Stocks[0].currentStock + 1;
				throw {
					message: "Promo product out of stock",
					maxStock,
				};
			}
			if (quantity > checkProduct?.Stocks[0].currentStock) throw { message: "Product out of stock" };
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
			const cart = await carts.findOne({
				where: {
					UserId: req.user.id,
					status: "ACTIVE",
				},
			});

			await cartItems.destroy({
				where: { CartId: cart.id },
			});

			res.status(200).send({
				status: true,
				message: "Cart cleared",
			});
		} catch (err) {
			res.status(400).send(err);
		}
	},
};
