const db = require("../models");
const products = db.Products;
const categories = db.Categories;
const users = db.Users;
const role = db.Roles;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");

module.exports = {
	addProduct: async (req, res) => {
		try {
			const { productName, price, description, CategoryId, weight } = req.body;
			const imgURL = req?.file?.filename;

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
				return res.status(400).send({
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

			if (isNaN(price)) {
				return res.status(400).send({
					status: 400,
					message: "Price must be a numeric value.",
				});
			}

			if (isNaN(weight)) {
				return res.status(400).send({
					status: 400,
					message: "Weight must be a numeric value.",
				});
			}

			if (isNaN(CategoryId)) {
				return res.status(400).send({
					status: 400,
					message: "You must select a category.",
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
			console.log(error);
			return res.status(500).send({
				error,
				status: 500,
				message: "Internal server error.",
			});
		}
	},
	updateProduct: async (req, res) => {
		try {
			const { PID } = req.params;
			const { productName, price, description, weight, CategoryId } = req.body;

			const product = await products.findOne({
				where: { id: PID },
			});

			if (isNaN(price)) {
				return res.status(400).send({
					status: 400,
					message: "Price must be a numeric value.",
				});
			}

			if (isNaN(weight)) {
				return res.status(400).send({
					status: 400,
					message: "Weight must be a numeric value.",
				});
			}

			if (isNaN(CategoryId)) {
				return res.status(400).send({
					status: 400,
					message: "You must select a category.",
				});
			}

			const oldImgURL = product.imgURL;
			const imgURL = req?.file?.filename || oldImgURL;
			const oldProductName = product.productName;
			const oldPrice = product.price;
			const oldDescription = product.description;
			const oldWeight = product.weight;
			const oldCategoryId = product.CategoryId;

			if (
				productName == oldProductName &&
				price == oldPrice &&
				description == oldDescription &&
				weight == oldWeight &&
				CategoryId == oldCategoryId &&
				imgURL == oldImgURL
			) {
				return res.status(400).send({
					status: 400,
					message: "You havent made any changes!",
				});
			}

			if (oldImgURL !== imgURL) {
				await products.update(
					{ productName, price, description, weight, CategoryId, imgURL: imgURL },
					{ where: { id: PID } }
				);
				res.status(200).send({
					status: 200,
					message: `${oldProductName}'s picture updated successfully.`,
				});
			} else {
				await products.update(
					{ productName, price, description, weight, CategoryId, imgURL: oldImgURL },
					{ where: { id: PID } }
				);
				res.status(200).send({
					status: 200,
					message: `${oldProductName} updated successfully.`,
				});
			}
		} catch (error) {
			return res.status(500).send({
				status: 500,
				message: "Internal server error.",
			});
		}
	},
	activateDeactivate: async (req, res) => {
		try {
			const { PID } = req.params;
			const product = await products.findOne({ where: { id: PID } });

			if (!product) {
				return res.status(404).send({
					status: 404,
					message: "Product is not found.",
				});
			}

			if (product.isDeleted) {
				return res.status(400).send({
					status: 400,
					message: `Activation unsuccessful, ${product.productName} has already been deleted. Please contact a sysadmin.`,
				});
			}

			if (product.isActive) {
				await products.update({ isActive: 0 }, { where: { id: PID } });
				res.status(200).send({
					status: 200,
					message: `Success: ${product.productName} has been deactivated successfully.`,
				});
			} else {
				await products.update({ isActive: 1 }, { where: { id: PID } });
				res.status(200).send({
					status: 200,
					message: `Success: ${product.productName} has been activated successfully.`,
				});
			}
		} catch (error) {
			return res.status(500).send({
				status: 500,
				message: "Internal server error.",
			});
		}
	},
	hardDelete: async (req, res) => {
		try {
			const { PID } = req.params;
			const product = await products.findOne({ where: { id: PID } });

			if (!product) {
				return res.status(404).send({
					status: 404,
					message: "Product is not found.",
				});
			}

			if (product.isDeleted) {
				return res.status(400).send({
					status: 400,
					message: `Deletion unsuccessful, ${product.productName} has already been deleted. Please contact a sysadmin.`,
				});
			} else {
				await products.update({ isActive: 0, isDeleted: 1 }, { where: { id: PID } });
				res.status(200).send({
					status: 200,
					message: `Success: ${product.productName} has been permanently deleted.`,
				});
			}
		} catch (error) {
			return res.status(500).send({
				status: 500,
				message: "Internal server error.",
			});
		}
	},
	getProduct: async (req, res) => {
		try {
			const { id } = req.params;
			const result = await products.findOne({
				where: {
					id: id,
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
			} else if (sortBy === "weight") {
				orderCriteria.push(["weight", sortOrder]);
			} else if (sortBy === "CategoryId") {
				orderCriteria.push(["CategoryId", sortOrder]);
			} else if (sortBy === "aggregateStock") {
				orderCriteria.push(["aggregateStock", sortOrder]);
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
	getAllProductsAdmin: async (req, res) => {
		try {
			const { search = "", CategoryId, page = 1, sortBy = "productName", sortOrder = "ASC" } = req.query;
			const itemLimit = parseInt(req.query.itemLimit, 10) || 15;

			const whereCondition = {
				productName: { [Op.like]: `%${search}%` },
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
			} else if (sortBy === "weight") {
				orderCriteria.push(["weight", sortOrder]);
			} else if (sortBy === "CategoryId") {
				orderCriteria.push(["CategoryId", sortOrder]);
			} else if (sortBy === "aggregateStock") {
				orderCriteria.push(["aggregateStock", sortOrder]);
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
			} else if (sortBy === "weight") {
				orderCriteria.push(["weight", sortOrder]);
			} else if (sortBy === "CategoryId") {
				orderCriteria.push(["CategoryId", sortOrder]);
			} else if (sortBy === "aggregateStock") {
				orderCriteria.push(["aggregateStock", sortOrder]);
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
			} else if (sortBy === "weight") {
				orderCriteria.push(["weight", sortOrder]);
			} else if (sortBy === "CategoryId") {
				orderCriteria.push(["CategoryId", sortOrder]);
			} else if (sortBy === "aggregateStock") {
				orderCriteria.push(["aggregateStock", sortOrder]);
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
	getDeletedProducts: async (req, res) => {
		try {
			const { search = "", CategoryId, page = 1, sortBy = "productName", sortOrder = "ASC" } = req.query;
			const itemLimit = parseInt(req.query.itemLimit, 10) || 15;

			const whereCondition = {
				productName: { [Op.like]: `%${search}%` },
				isActive: false,
				isDeleted: true,
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
			} else if (sortBy === "weight") {
				orderCriteria.push(["weight", sortOrder]);
			} else if (sortBy === "CategoryId") {
				orderCriteria.push(["CategoryId", sortOrder]);
			} else if (sortBy === "aggregateStock") {
				orderCriteria.push(["aggregateStock", sortOrder]);
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
	bulkUpdateCategory: async (req, res) => {
		try {
			const { newCategoryId, PIDs } = req.body;

			if (!newCategoryId || !Array.isArray(PIDs) || PIDs.length === 0) {
				return res.status(400).send({
					status: 400,
					message: "Invalid request body.",
				});
			}

			const updatedProducts = await products.update(
				{ CategoryId: newCategoryId },
				{
					where: {
						id: {
							[Op.in]: PIDs,
						},
					},
				}
			);

			if (updatedProducts[0] === 0) {
				return res.status(404).send({
					status: 404,
					message: "No products found with the provided PIDs.",
				});
			}

			return res.status(200).send({
				status: 200,
				message: "Products' category updated successfully.",
			});
		} catch (error) {
			return res.status(500).send({
				status: 500,
				message: "Internal server error.",
				error,
			});
		}
	},
	bulkActivate: async (req, res) => {
		try {
			const { PIDs } = req.body;

			if (!Array.isArray(PIDs) || PIDs.length === 0) {
				return res.status(400).send({
					status: 400,
					message: "Invalid request body.",
				});
			}

			const updatedProducts = await products.update(
				{ isActive: true },
				{
					where: {
						id: {
							[Op.in]: PIDs,
						},
					},
				}
			);

			if (updatedProducts[0] === 0) {
				return res.status(404).send({
					status: 404,
					message: "No products found with the provided PIDs.",
				});
			}

			return res.status(200).send({
				status: 200,
				message: "Products activated successfully.",
			});
		} catch (error) {
			return res.status(500).send({
				status: 500,
				message: "Internal server error.",
				error,
			});
		}
	},
	bulkDeactivate: async (req, res) => {
		try {
			const { PIDs } = req.body;

			if (!Array.isArray(PIDs) || PIDs.length === 0) {
				return res.status(400).send({
					status: 400,
					message: "Invalid request body.",
				});
			}

			const findDeactivated = await products.findOne({
				where: {
					id: {
						[Op.in]: PIDs,
					},
					isActive: false,
				},
			});

			if (findDeactivated) {
				return res.status(400).send({
					status: 400,
					message: "Some of the selected products are already inactive.",
				});
			}

			const updatedProducts = await products.update(
				{ isActive: false },
				{
					where: {
						id: {
							[Op.in]: PIDs,
						},
					},
				}
			);

			if (updatedProducts[0] === 0) {
				return res.status(404).send({
					status: 404,
					message: "No products found with the provided PIDs.",
				});
			}

			return res.status(200).send({
				status: 200,
				message: "Products deactivated successfully.",
			});
		} catch (error) {
			return res.status(500).send({
				status: 500,
				message: "Internal server error.",
				error,
			});
		}
	},
	bulkDelete: async (req, res) => {
		try {
			const { PIDs } = req.body;

			if (!Array.isArray(PIDs) || PIDs.length === 0) {
				return res.status(400).send({
					status: 400,
					message: "Invalid request body.",
				});
			}

			const updatedProducts = await products.update(
				{
					isActive: false,
					isDeleted: true,
				},
				{
					where: {
						id: {
							[Op.in]: PIDs,
						},
					},
				}
			);

			if (updatedProducts[0] === 0) {
				return res.status(404).send({
					status: 404,
					message: "No products found with the provided PIDs.",
				});
			}

			return res.status(200).send({
				status: 200,
				message: "Products permanently deleted successfully.",
			});
		} catch (error) {
			return res.status(500).send({
				status: 500,
				message: "Internal server error.",
				error,
			});
		}
	},
};
