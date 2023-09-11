const db = require("../models");
const products = db.Products;
const users = db.Users;
const role = db.Roles;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");

module.exports = {
	addProduct: async (req, res) => {
		try {
			const { productName, price, description, CategoryId, weight } = req.body;
			const imgURL = req.file.filename;

			if (!productName) {
				return res.status(400).send({
					status: 400,
					message: "Product name cannot be empty.",
				});
			}

			if (
				await products.findOne({
					where: {
						productName: productName,
					},
				})
			) {
				res.status(400).send({
					status: 400,
					message: "Product name already exists. Did you mean to update product?",
				});
			}

			if (!price) {
				return res.status(400).send({
					status: 400,
					message: "Price cannot be empty.",
				});
			}

			if (!description) {
				return res.status(400).send({
					status: 400,
					message: "Description cannot be empty.",
				});
			}

			if (!CategoryId) {
				return res.status(400).send({
					status: 400,
					message: "Please assign a product category.",
				});
			}

			if (!weight) {
				return res.status(400).send({
					status: 400,
					message: "Weight cannot be empty. Please input a minimum of 1 gram.",
				});
			}

			if (!imgURL) {
				return res.status(400).send({
					status: 400,
					message: "Please assign a product image.",
				});
			}

			const newProduct = await products.create({
				productName,
				price,
				imgURL,
				description,
				CategoryId,
				weight,
			});

			return res.status(201).send({
				status: 201,
				message: "Product created successfully.",
				product: newProduct,
			});
		} catch (error) {
			return res.status(500).send({
				error,
				status: 500,
				message: "Internal server error.",
			});
		}
	},
	updateProduct: async (req, res) => {
		try {
			const { id } = req.params;
			const { price, productName, stock, description } = req.body;
			const imgURL = req.file.filename;

			const result = await products.update(
				{ price, productName, stock, description, imgURL: imgURL },
				{ where: { id: id } }
			);
			res.status(200).send({
				status: 200,
				message: "Product update successful.",
				result,
			});
		} catch (error) {
			return res.status(500).send({
				status: 500,
				message: "Internal server error.",
			});
		}
	},
	activateDeactivate: async (req, res) => {
		try {
			const product = await products.findOne({ where: { id: req.body.productId } });

			if (product.isDeleted) {
				await products.update({ isDeleted: 0 }, { where: { id: product.id } });
				res.status(200).send({
					status: 200,
					message: `${product.productName} deactivated successfully.`,
				});
			} else {
				await products.update({ isActive: 1 }, { where: { id: product.id } });
				res.status(200).send({
					status: 200,
					message: `${product.productName} activated successfully.`,
				});
			}
		} catch (error) {
			return res.status(500).send({
				status: 500,
				message: "Internal server error.",
			});
		}
	},
	// hardDelete: async (req, res) => {
	// 	try {
	// 		const product = await products.findOne({ where: { id: req.body.productId } });
	// 		const user = await users.findOne({ where: { id: req.body.userId } });
	// 		const password = req.body.password;
	// 		const isValid = bcrypt

	// 		if (product.isDeleted) {
	// 			await products.update({ isDeleted: 0 }, { where: { id: product.id } });
	// 			res.status(200).send({
	// 				status: 200,
	// 				message: `${product.productName} deactivated successfully.`,
	// 			});
	// 		} else {
	// 			await products.update({ isActive: 1 }, { where: { id: product.id } });
	// 			res.status(200).send({
	// 				status: 200,
	// 				message: `${product.productName} activated successfully.`,
	// 			});
	// 		}
	// 	} catch (error) {
	// 		return res.status(500).send({
	// 			status: 500,
	// 			message: "Internal server error.",
	// 		});
	// 	}
	// },
	getProduct: async (req, res) => {
		try {
			const { id } = req.params;
			const result = await products.findOne({
				where: {
					id: id,
					isDeleted: false,
				},
			});

			if (!id) {
				return res.status(400).send({
					status: 400,
					message: "Please input a valid product ID.",
				});
			}

			if (!result) {
				return res.status(404).send({
					status: 404,
					message: "Product is not found.",
				});
			}

			res.status(200).send({
				status: 200,
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
	getProductsByCategory: async (req, res) => {
		try {
			const id = req.params.id;
			const page = parseInt(req.query.page) || 1;
			const limit = parseInt(req.query.limit) || 15;
			const queriedCount = await products.count({
				where: { CategoryId: id, isDeleted: false },
			});
			const result = await products.findAll({
				where: { CategoryId: id, isDeleted: 0 },
				limit,
				offset: limit * (page - 1),
			});
			res.status(200).send({
				page: page,
				totalPage: Math.ceil(queriedCount / limit),
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
	getAllProducts: async (req, res) => {
		try {
			const { search = "", CategoryId, page = 1, sortBy = "productName", sortOrder = "ASC" } = req.query;
			const itemLimit = parseInt(req.query.itemLimit, 10) || 15;

			const whereCondition = {
				productName: { [Op.like]: `%${search}%` },
				isActive: true,
				isDeleted: false,
			};

			if (CategoryId) {
				whereCondition.CategoryId = CategoryId;
			}

			const queriedCount = await products.count({
				where: whereCondition,
			});

			let orderCriteria = [];
			if (sortBy === "productName") {
				orderCriteria.push(["productName", sortOrder]);
			} else if (sortBy === "price") {
				orderCriteria.push(["price", sortOrder]);
			} else if (sortBy === "createdAt") {
				orderCriteria.push(["createdAt", sortOrder]);
			}  else if (sortBy === "weight") {
				orderCriteria.push(["weight", sortOrder]);
			} else {
				orderCriteria.push(["productName", "ASC"]);
			}

			const result = await products.findAll({
				where: whereCondition,
				order: orderCriteria,
				limit: itemLimit,
				offset: itemLimit * (page - 1),
			});

			const totalPages = Math.ceil(queriedCount / itemLimit);

			return res.status(200).send({
				totalProducts: queriedCount,
				productsPerPage: itemLimit,
				totalPages,
				currentPage: page,
				result,
			});
		} catch (error) {
			return res.status(500).send({
				status: 500,
				message: "Internal server error.",
			});
		}
	},
	getActiveProducts: async (req, res) => {
		try {
			const { search = "", CategoryId, page = 1, sortBy = "productName", sortOrder = "ASC" } = req.query;
			const itemLimit = parseInt(req.query.itemLimit, 10) || 15;

			const whereCondition = {
				productName: { [Op.like]: `%${search}%` },
				isActive: true,
			};

			if (CategoryId) {
				whereCondition.CategoryId = CategoryId;
			}

			const queriedCount = await products.count({
				where: whereCondition,
			});

			let orderCriteria = [];
			if (sortBy === "productName") {
				orderCriteria.push(["productName", sortOrder]);
			} else if (sortBy === "price") {
				orderCriteria.push(["price", sortOrder]);
			} else if (sortBy === "createdAt") {
				orderCriteria.push(["createdAt", sortOrder]);
			} else {
				orderCriteria.push(["productName", "ASC"]);
			}

			const result = await products.findAll({
				where: whereCondition,
				order: orderCriteria,
				limit: itemLimit,
				offset: itemLimit * (page - 1),
			});

			const totalPages = Math.ceil(queriedCount / itemLimit);

			return res.status(200).send({
				totalProducts: queriedCount,
				productsPerPage: itemLimit,
				totalPages,
				currentPage: page,
				result,
			});
		} catch (error) {
			return res.status(500).send({
				status: 500,
				message: "Internal server error.",
			});
		}
	},
	getDeactivatedProducts: async (req, res) => {
		try {
			const { search = "", CategoryId, page = 1, sortBy = "productName", sortOrder = "ASC" } = req.query;
			const itemLimit = parseInt(req.query.itemLimit, 10) || 15;

			const whereCondition = {
				productName: { [Op.like]: `%${search}%` },
				isActive: false,
			};

			if (CategoryId) {
				whereCondition.CategoryId = CategoryId;
			}

			const queriedCount = await products.count({
				where: whereCondition,
			});

			let orderCriteria = [];
			if (sortBy === "productName") {
				orderCriteria.push(["productName", sortOrder]);
			} else if (sortBy === "price") {
				orderCriteria.push(["price", sortOrder]);
			} else if (sortBy === "createdAt") {
				orderCriteria.push(["createdAt", sortOrder]);
			} else {
				orderCriteria.push(["productName", "ASC"]);
			}

			const result = await products.findAll({
				where: whereCondition,
				order: orderCriteria,
				limit: itemLimit,
				offset: itemLimit * (page - 1),
			});

			const totalPages = Math.ceil(queriedCount / itemLimit);

			return res.status(200).send({
				totalProducts: queriedCount,
				productsPerPage: itemLimit,
				totalPages,
				currentPage: page,
				result,
			});
		} catch (error) {
			return res.status(500).send({
				status: 500,
				message: "Internal server error.",
			});
		}
	},
};
