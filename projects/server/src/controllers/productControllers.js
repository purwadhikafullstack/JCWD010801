const db = require("../models");
const users = db.Users;
const categories = db.Categories;
const products = db.Products;
const changelogs = db.Changelogs;
const stocks = db.Stocks;
const stockMovements = db.StockMovements;
const discounts = db.Discounts;
const wishlists = db.Wishlists;
const { Sequelize, Op } = require("sequelize");

module.exports = {
	addProduct: async (req, res) => {
		try {
			const { productName, price, description, CategoryId, weight, stock, BranchId, UID } = req.body;
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

			if (!stock) {
				return res.status(400).send({
					status: 400,
					message: "Stock cannot be empty. Please input a minimum of 1 unit.",
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

			if (isNaN(stock)) {
				return res.status(400).send({
					status: 400,
					message: "Stock must be a numeric value.",
				});
			}

			const newProduct = await products.create({
				productName,
				price,
				imgURL,
				description,
				CategoryId,
				weight,
				aggregateStock: stock,
			});

			const branchStock = await stocks.findOne({
				where: {
					ProductId: newProduct.id,
					BranchId: BranchId,
				},
			});

			const updatedCurrentStock = branchStock ? branchStock.currentStock + stock : stock;

			const additions = {};
			additions.productName = {
				oldValue: "initialization",
				newValue: productName,
			};
			additions.price = {
				oldValue: "initialization",
				newValue: price,
			};
			additions.description = {
				oldValue: "initialization",
				newValue: description,
			};
			additions.weight = {
				oldValue: "initialization",
				newValue: weight,
			};
			additions.CategoryId = {
				oldValue: "initialization",
				newValue: CategoryId,
			};
			additions.imgURL = {
				oldValue: "initialization",
				newValue: imgURL,
			};

			if (branchStock) {
				return res.status(400).send({
					error,
					status: 400,
					message: "Product name already exists. Did you mean to update product?",
				});
			} else {
				await stocks.create({
					currentStock: updatedCurrentStock,
					ProductId: newProduct.id,
					BranchId: BranchId,
				});

				await stockMovements.create({
					change: updatedCurrentStock,
					oldValue: 0,
					newValue: updatedCurrentStock,
					isAddition: true,
					isAdjustment: false,
					isInitialization: true,
					isBranchInitialization: false,
					BranchId: BranchId,
					ProductId: newProduct.id,
					UserId: UID,
				});

				for (const field in additions) {
					await changelogs.create({
						field,
						oldValue: additions[field].oldValue,
						newValue: additions[field].newValue,
						UserId: UID,
						ProductId: newProduct.id,
					});
				}
			}

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
			const { PID } = req.params;
			const { UserId, productName, price, description, weight, CategoryId, stock, BranchId } = req.body;

			const joinCondition = {
				model: stocks,
				where: { BranchId: parseInt(BranchId) || 1 },
				required: false,
			};

			const product = await products.findOne({
				where: { id: PID },
				include: [joinCondition],
			});

			if (!product) {
				return res.status(404).send({
					status: 404,
					message: "Product not found.",
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

			if (isNaN(stock)) {
				return res.status(400).send({
					status: 400,
					message: "Stock must be a numeric value.",
				});
			}

			const oldImgURL = product.imgURL;
			const imgURL = req?.file?.filename || oldImgURL;
			const oldProductName = product.productName;
			const oldPrice = product.price;
			const oldDescription = product.description;
			const oldWeight = product.weight;
			const oldCategoryId = product.CategoryId;
			const oldStock = parseInt(product?.Stocks[0]?.dataValues?.currentStock);

			if (
				productName == oldProductName &&
				price == oldPrice &&
				description == oldDescription &&
				weight == oldWeight &&
				CategoryId == oldCategoryId &&
				imgURL == oldImgURL &&
				stock == oldStock
			) {
				return res.status(400).send({
					status: 400,
					message: "You havent made any changes!",
				});
			}

			const changes = {};

			if (productName !== oldProductName) {
				changes.productName = {
					oldValue: oldProductName,
					newValue: productName,
				};
			}

			if (parseInt(price) !== parseInt(oldPrice)) {
				changes.price = {
					oldValue: oldPrice,
					newValue: price,
				};
			}

			if (description !== oldDescription) {
				changes.description = {
					oldValue: oldDescription,
					newValue: description,
				};
			}

			if (parseInt(weight) !== parseInt(oldWeight)) {
				changes.weight = {
					oldValue: oldWeight,
					newValue: weight,
				};
			}

			if (parseInt(CategoryId) !== parseInt(oldCategoryId)) {
				changes.CategoryId = {
					oldValue: oldCategoryId,
					newValue: CategoryId,
				};
			}

			if (imgURL !== oldImgURL) {
				changes.imgURL = {
					oldValue: oldImgURL,
					newValue: imgURL,
				};
			}

			const stockDelta = parseInt(stock) - parseInt(oldStock);

			if (stockDelta !== 0 && !isNaN(stockDelta) && !isNaN(oldStock)) {
				const isAddition = stockDelta > 0;

				await stockMovements.create({
					ProductId: PID,
					BranchId: BranchId,
					oldValue: oldStock,
					newValue: stock,
					change: stockDelta,
					isAddition: isAddition,
					isAdjustment: true,
					isInitialization: false,
					UserId: UserId,
				});
			}

			if (stock && isNaN(stockDelta) && isNaN(oldStock)) {
				await stockMovements.create({
					ProductId: PID,
					BranchId: BranchId,
					oldValue: 0,
					newValue: stock,
					change: stock,
					isAddition: true,
					isAdjustment: false,
					isInitialization: false,
					isBranchInitialization: true,
					UserId: UserId,
				});
			}

			if (oldImgURL !== imgURL) {
				await products.update(
					{ productName, price, description, weight, CategoryId, imgURL: imgURL },
					{ where: { id: PID } }
				);

				for (const field in changes) {
					await changelogs.create({
						field,
						oldValue: changes[field].oldValue,
						newValue: changes[field].newValue,
						UserId: UserId,
						ProductId: PID,
					});
				}

				if (oldStock === undefined || isNaN(oldStock)) {
					await stocks.create({ currentStock: Math.max(0, stock), ProductId: PID, BranchId: BranchId });

					await products.increment("aggregateStock", { by: stock, where: { id: PID } });
				} else {
					await stocks.update(
						{ currentStock: Math.max(0, stock) },
						{
							where: {
								ProductId: PID,
								BranchId: BranchId,
							},
						}
					);

					if (oldStock < stock) {
						const addition = stock - oldStock;
						await products.increment("aggregateStock", { by: addition, where: { id: PID } });
					} else if (oldStock > stock) {
						const reduction = oldStock - stock;
						await products.decrement("aggregateStock", { by: reduction, where: { id: PID } });
					}
				}

				res.status(200).send({
					status: 200,
					message: `${oldProductName}'s picture & other infos(if any) have been updated successfully.`,
				});
			} else {
				await products.update(
					{ productName, price, description, weight, CategoryId, imgURL: oldImgURL },
					{ where: { id: PID } }
				);

				for (const field in changes) {
					await changelogs.create({
						field,
						oldValue: changes[field].oldValue,
						newValue: changes[field].newValue,
						UserId: UserId,
						ProductId: PID,
					});
				}

				if (oldStock === undefined || isNaN(oldStock)) {
					await stocks.create({ currentStock: Math.max(0, stock), ProductId: PID, BranchId: BranchId });

					await products.increment("aggregateStock", { by: stock, where: { id: PID } });
				} else {
					await stocks.update(
						{ currentStock: Math.max(0, stock) },
						{
							where: {
								ProductId: PID,
								BranchId: BranchId,
							},
						}
					);

					if (oldStock < stock) {
						const addition = stock - oldStock;
						await products.increment("aggregateStock", { by: addition, where: { id: PID } });
					} else if (oldStock > stock) {
						const reduction = oldStock - stock;
						await products.decrement("aggregateStock", { by: reduction, where: { id: PID } });
					}
				}

				res.status(200).send({
					status: 200,
					message: `${oldProductName} has been updated successfully.`,
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
			const { id } = req.body;
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

				await changelogs.create({
					field: "deactivation",
					oldValue: "active",
					newValue: "deactivated",
					UserId: id,
					ProductId: PID,
				});

				res.status(200).send({
					status: 200,
					message: `Success: ${product.productName} has been deactivated successfully.`,
				});
			} else {
				await products.update({ isActive: 1 }, { where: { id: PID } });

				await changelogs.create({
					field: "activation",
					oldValue: "deactivated",
					newValue: "active",
					UserId: id,
					ProductId: PID,
				});

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
			const { id } = req.body;
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

				await changelogs.create({
					field: "deletion",
					oldValue: "not_deleted",
					newValue: "deleted",
					UserId: id,
					ProductId: PID,
				});

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
			const { BranchId } = req.query;

			const result = await products.findOne({
				where: {
					id: id,
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
						required: false,
					},
				],
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
			const { search = "", CategoryId, page = 1, sortBy = "productName", sortOrder = "ASC", BranchId = 1 } = req.query;
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

			const joinCondition = {
				model: stocks,
				where: { BranchId: BranchId },
				required: false,
			};

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
			} else if (sortBy === "branchStock") {
				orderCriteria.push([
					Sequelize.literal(`(SELECT IFNULL(SUM(currentStock), 0) FROM stocks WHERE stocks.ProductId = products.id)`),
					sortOrder,
				]);
			} else {
				orderCriteria.push(["productName", "ASC"]);
			}

			const result = await products.findAll({
				where: whereCondition,
				order: orderCriteria,
				limit: itemLimit,
				offset: itemLimit * (page - 1),
				include: [joinCondition],
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
			console.log(error);
			return res.status(500).send({
				status: 500,
				message: "Internal server error.",
			});
		}
	},
	getActiveProducts: async (req, res) => {
		try {
			const { search = "", CategoryId, page = 1, sortBy = "productName", sortOrder = "ASC", BranchId = 1 } = req.query;
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

			const joinCondition = {
				model: stocks,
				where: { BranchId: BranchId },
				required: false,
			};

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
			} else if (sortBy === "branchStock") {
				orderCriteria.push([
					Sequelize.literal(`(SELECT IFNULL(SUM(currentStock), 0) FROM stocks WHERE stocks.ProductId = products.id)`),
					sortOrder,
				]);
			} else {
				orderCriteria.push(["productName", "ASC"]);
			}

			const result = await products.findAll({
				where: whereCondition,
				order: orderCriteria,
				limit: itemLimit,
				offset: itemLimit * (page - 1),
				include: [joinCondition],
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
			const { search = "", CategoryId, page = 1, sortBy = "productName", sortOrder = "ASC", BranchId = 1 } = req.query;
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

			const joinCondition = {
				model: stocks,
				where: { BranchId: BranchId },
				required: false,
			};

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
			} else if (sortBy === "branchStock") {
				orderCriteria.push([
					Sequelize.literal(`(SELECT IFNULL(SUM(currentStock), 0) FROM stocks WHERE stocks.ProductId = products.id)`),
					sortOrder,
				]);
			} else {
				orderCriteria.push(["productName", "ASC"]);
			}

			const result = await products.findAll({
				where: whereCondition,
				order: orderCriteria,
				limit: itemLimit,
				offset: itemLimit * (page - 1),
				include: [joinCondition],
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
			const { search = "", CategoryId, page = 1, sortBy = "productName", sortOrder = "ASC", BranchId = 1 } = req.query;
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

			const joinCondition = {
				model: stocks,
				where: { BranchId: BranchId },
				required: false,
			};

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
			} else if (sortBy === "branchStock") {
				orderCriteria.push([
					Sequelize.literal(`(SELECT IFNULL(SUM(currentStock), 0) FROM stocks WHERE stocks.ProductId = products.id)`),
					sortOrder,
				]);
			} else {
				orderCriteria.push(["productName", "ASC"]);
			}

			const result = await products.findAll({
				where: whereCondition,
				order: orderCriteria,
				limit: itemLimit,
				offset: itemLimit * (page - 1),
				include: [joinCondition],
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
			const { UID, newCategoryId, PIDs } = req.body;

			if (!newCategoryId || !Array.isArray(PIDs) || PIDs.length === 0) {
				return res.status(400).send({
					status: 400,
					message: "Invalid request body.",
				});
			}

			const newCategoryData = await categories.findOne({
				where: {
					id: newCategoryId,
				},
			});
			const newCategoryName = newCategoryData?.dataValues?.category || "data_not_available";

			for (const PID of PIDs) {
				await changelogs.create({
					field: "bulk_cat_change",
					oldValue: "data_not_available",
					newValue: newCategoryName,
					UserId: UID,
					ProductId: PID,
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
			const { id } = req.body;

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

			for (const PID of PIDs) {
				await changelogs.create({
					field: "bulk_activation",
					oldValue: "deactivated",
					newValue: "active",
					UserId: id,
					ProductId: PID,
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
			const { id } = req.body;

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

			for (const PID of PIDs) {
				await changelogs.create({
					field: "bulk_deactivation",
					oldValue: "active",
					newValue: "deactivated",
					UserId: id,
					ProductId: PID,
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
			const { id } = req.body;

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

			for (const PID of PIDs) {
				await changelogs.create({
					field: "bulk_deletion",
					oldValue: "not_deleted",
					newValue: "deleted",
					UserId: id,
					ProductId: PID,
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
	getBranchStock: async (req, res) => {
		try {
			const { id } = req.params;
			const { BranchId } = req.query;
			const result = await stocks.findOne({
				where: {
					ProductId: id,
					BranchId: BranchId,
				},
			});

			const product = await stocks.findOne({
				where: {
					ProductId: id,
				},
			});

			if (!product) {
				return res.status(404).send({
					status: 404,
					message: "This product doesn't exist.",
				});
			}

			if (!id) {
				return res.status(400).send({
					status: 400,
					message: "Please input a valid product ID.",
				});
			}

			if (!BranchId) {
				return res.status(404).send({
					status: 404,
					message: "Please input a valid Branch ID.",
				});
			}

			res.status(200).send({
				status: 200,
				PID: result?.ProductId || product.ProductId,
				BranchId: result?.BranchId || parseInt(BranchId),
				currentStock: result?.currentStock || 0,
			});
		} catch (error) {
			return res.status(500).send({
				error,
				status: 500,
				message: "Internal server error.",
			});
		}
	},
	addOneUserView: async (req, res) => {
		try {
			const { PID } = req.params;
			const { RoleId } = req.body;

			const product = await products.findOne({
				where: { id: PID },
			});

			if (!product) {
				return res.status(404).send({
					status: 404,
					message: "Product not found.",
				});
			}

			if (RoleId === undefined) {
				await product.update({
					viewCount: +product.viewCount + 1,
				});

				return res.status(200).send({
					status: 200,
					message: "View count updated successfully.",
				});
			}

			if (RoleId < 2) {
				await product.update({
					viewCount: +product.viewCount + 1,
				});

				return res.status(200).send({
					status: 200,
					message: "View count updated successfully.",
				});
			}

			if (RoleId >= 2) {
				return res.status(400).send({
					status: 400,
					message: "View count not added for admins.",
				});
			}
		} catch (error) {
			return res.status(500).send({
				status: 500,
				message: "Internal server error.",
			});
		}
	},
	getRandomProductName: async (req, res) => {
		try {
			const productCount = await products.count();
			const randomIndex = Math.floor(Math.random() * productCount);

			const randomProduct = await products.findOne({
				attributes: ["productName"],
				offset: randomIndex,
			});

			if (!randomProduct) {
				return res.status(404).send({
					status: 404,
					message: "Randomizer failed.",
				});
			}

			return res.status(200).send({
				status: 200,
				productName: randomProduct.productName,
			});
		} catch (error) {
			return res.status(500).send({
				status: 500,
				message: "Internal server error.",
			});
		}
	},
	likeUnlike: async (req, res) => {
		try {
			const { PID } = req.params;
			const { UID } = req.query;

			const user = await users.findOne({
				where: {
					id: UID,
				},
			});

			if (!user) {
				return res.status(400).send({
					status: 400,
					message: "Please login to add this product to your wishlist.",
				});
			}

			if (user.RoleId > 1) {
				return res.status(403).send({
					status: 403,
					message: "Admins do not have a wishlist!",
				});
			}

			const product = await products.findOne({ where: { id: PID } });

			if (!product) {
				return res.status(404).send({
					status: 404,
					message: "Product is not found.",
				});
			}

			const wishlistedItem = await wishlists.findOne({
				where: {
					UserId: UID,
					ProductId: PID,
				},
			});

			if (!wishlistedItem) {
				await wishlists.create({
					isLiked: true,
					UserId: UID,
					ProductId: PID,
				});

				await product.update({
					likeCount: +product.likeCount + 1,
				});

				return res.status(200).send({
					status: 200,
					message: `${product.productName} successfully added to your wishlist 😊`,
				});
			} else if (wishlistedItem.isLiked === true) {
				await wishlistedItem.update({
					isLiked: !wishlistedItem.isLiked,
				});

				await product.update({
					likeCount: +product.likeCount - 1,
				});

				return res.status(200).send({
					status: 200,
					message: `${product.productName} successfully removed from your wishlist 😔`,
				});
			} else if (wishlistedItem.isLiked === false) {
				await wishlistedItem.update({
					isLiked: !wishlistedItem.isLiked,
				});

				await product.update({
					likeCount: +product.likeCount + 1,
				});

				return res.status(200).send({
					status: 200,
					message: `${product.productName} successfully added to your wishlist 😊`,
				});
			}
		} catch (error) {
			return res.status(500).send({
				status: 500,
				message: "Internal server error.",
			});
		}
	},
	getLikeStatus: async (req, res) => {
		try {
			const { PID } = req.params;
			const { UID } = req.query;

			const product = await products.findOne({ where: { id: PID } });

			if (!product) {
				return res.status(404).send({
					status: 404,
					message: "Product is not found.",
				});
			}

			const user = await users.findOne({
				where: {
					id: UID,
				},
			});

			if (!user) { 
				return res.status(404).send({
					status: 404,
					message: "Non logged in users do not have a wishlist.",
				});
			}

			const wishlistedItem = await wishlists.findOne({
				where: {
					UserId: UID,
					ProductId: PID,
				},
			});

			if (!wishlistedItem) {
				return res.status(404).send({
					status: 404,
					likeStatus: false,
					message: "Product is not yet liked by this user.",
				});
			}

			return res.status(200).send({
				status: 200,
				likeStatus: wishlistedItem.isLiked,
				message: "Liked status fetched successfully.",
			});
		} catch (error) {
			return res.status(500).send({
				status: 500,
				message: "Internal server error.",
			});
		}
	},
	getUserWishlist: async (req, res) => {
		try {
			const { UID } = req.query;

			const user = await users.findOne({
				where: {
					id: UID,
				},
			});

			if (user.RoleId > 1) {
				return res.status(400).send({
					status: 400,
					message: "Admins do not have a wishlist!",
				});
			}

			if (!user) { 
				return res.status(404).send({
					status: 404,
					message: "Non logged in users do not have a wishlist.",
				});
			}

			const wishlistedItems = await wishlists.findAll({
				where: {
					UserId: UID,
				},
			});

			if (wishlistedItems.length === 0) {
				return res.status(404).send({
					status: 404,
					message: "Users don't have any product wishlisted yet.",
				});
			}

			return res.status(200).send({
				status: 200,
				message: "Wishlisted products fetched successfully.",
				wishlist: wishlistedItems
			});
		} catch (error) {
			return res.status(500).send({
				status: 500,
				message: "Internal server error.",
			});
		}
	},
	getProductSuggestions: async(req, res) => {
		try {
			const limit = +req.query.limit || 12

			const result = await products.findAll({
				order: Sequelize.literal('rand()'),
				limit,
				where: { isActive: true },
				include: [
					{
						model: discounts
					}
				]
			})

			return res.status(200).send({
				status: 200,
				result
			});
		} catch (error) {
			return res.status(500).send({
				status: 500,
				message: "Internal server error.",
			});
		}
	}
};
