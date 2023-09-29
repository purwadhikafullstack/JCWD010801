const db = require("../models");
const categories = db.Categories;
const products = db.Products;
const stocks = db.Stocks;
const stockMovements = db.StockMovements;
const changelogs = db.Changelogs;
const { Sequelize, Op } = require("sequelize");

module.exports = {
	getProductReport: async (req, res) => {
		try {
			const {
				productName,
				BranchId = null,
				startDate = null,
				endDate = null,
				UserId = null,
				page = 1,
				itemLimit = 20,
				sortBy = "createdAt",
				sortOrder = "ASC",
			} = req.query;

			if (!productName) {
				return res.status(404).send({
					status: 404,
					message: "Please specify a product name.",
				});
			}

			const product = await products.findOne({
				where: {
					productName: productName,
				},
			});

			if (!product) {
				return res.status(404).send({
					status: 404,
					message: "Product is not found.",
				});
			}

			const filterMovement = {
				ProductId: product.id,
			};

			if (startDate && endDate) {
				filterMovement.createdAt = {
					[Op.between]: [new Date(startDate), new Date(endDate)],
				};
			} else if (startDate || endDate) {
				if (startDate) {
					filterMovement.createdAt = {
						[Op.gte]: new Date(startDate),
					};
				}

				if (endDate) {
					filterMovement.createdAt = {
						[Op.lte]: new Date(endDate),
					};
				}
			}

			if (BranchId) {
				filterMovement.BranchId = BranchId;
			}

			if (UserId) {
				filterMovement.UserId = UserId;
			}

			const offset = (page - 1) * parseInt(itemLimit);

			let sortOption;
			switch (sortBy) {
				case "UserId":
					sortOption = [["UserId", sortOrder]];
					break;
				case "BranchId":
					sortOption = [["BranchId", sortOrder]];
					break;
				case "change":
					sortOption = [["change", sortOrder]];
					break;
				default:
					sortOption = [["createdAt", sortOrder]];
			}

			const movementHistory = await stockMovements.findAll({
				where: filterMovement,
				limit: parseInt(itemLimit),
				offset: offset,
				order: sortOption,
			});

			const totalCount = await stockMovements.count({
				where: filterMovement,
			});

			const totalPages = Math.ceil(totalCount / parseInt(itemLimit));

			res.status(200).send({
				status: 200,
				currentPage: parseInt(page),
				totalPages: totalPages,
				product_details: product,
				movement_history: movementHistory,
			});
		} catch (error) {
			return res.status(500).send({
				status: 500,
				message: "Internal server error.",
				error,
			});
		}
	},
	mostAndLeast: async (req, res) => {
		try {
			const categoriesData = await categories.findAll({
				include: [products],
			});

			const result = categoriesData.map((category) => {
				const productsData = category.Products;

				const sortedProducts = {
					byAggregateStock: productsData.slice().sort((a, b) => b.aggregateStock - a.aggregateStock),
					byLowAggregateStock: productsData.slice().sort((a, b) => a.aggregateStock - b.aggregateStock),
					byViews: productsData.slice().sort((a, b) => b.viewCount - a.viewCount),
					byLowViews: productsData.slice().sort((a, b) => a.viewCount - b.viewCount),
				};

				const categoryProducts = {
					topAggregateStock: sortedProducts.byAggregateStock.slice(0, 3),
					lowAggregateStock: sortedProducts.byLowAggregateStock.slice(0, 3),
					topViews: sortedProducts.byViews.slice(0, 3),
					lowViews: sortedProducts.byLowViews.slice(0, 3),
				};

				return {
					id: category.id,
					category: category.category,
					imgURL: category.imgURL,
					isDeleted: category.isDeleted,
					productCount: productsData.length,
					products: categoryProducts,
				};
			});

			res.status(200).send({
				status: 200,
				result: result,
			});
		} catch (error) {
			return res.status(500).send({
				status: 500,
				message: "Internal server error.",
				error,
			});
		}
	},
	getAllProductsDataInCategories: async (req, res) => {
		try {
			const { sortBy = "aggregateStock", order = "DESC" } = req.query;
			const validSortOptions = ["aggregateStock", "viewCount"];
			const validSortOrders = ["ASC", "DESC"];

			if (!validSortOptions.includes(sortBy) || !validSortOrders.includes(order)) {
				return res.status(400).send({
					status: 400,
					message:
						"Invalid sorting options. Please use 'aggregateStock' or 'viewCount' for 'sortBy' and 'ASC' or 'DESC' for 'order'.",
				});
			}

			const categoriesData = await categories.findAll({
				include: [products],
			});

			const result = categoriesData.map((category) => {
				const productsData = category.Products;

				const sortedProducts = productsData.slice().sort((a, b) => {
					if (order === "ASC") {
						return a[sortBy] - b[sortBy];
					} else {
						return b[sortBy] - a[sortBy];
					}
				});

				return {
					id: category.id,
					category: category.category,
					imgURL: category.imgURL,
					isDeleted: category.isDeleted,
					productCount: productsData.length,
					products: sortedProducts,
				};
			});

			res.status(200).send({
				status: 200,
				result: result,
			});
		} catch (error) {
			return res.status(500).send({
				status: 500,
				message: "Internal server error.",
				error,
			});
		}
	},
	getAverageProductsPerCategory: async (req, res) => {
		try {
			const categoriesData = await categories.findAll({
				include: [products],
			});

			const totalProductCount = categoriesData.reduce((total, category) => total + category.Products.length, 0);

			const averageProductCount = Math.round(totalProductCount / categoriesData.length);

			res.status(200).send({
				status: 200,
				result: averageProductCount,
			});
		} catch (error) {
			return res.status(500).send({
				status: 500,
				message: "Internal server error.",
				error,
			});
		}
	},
	getProductStatusCountsByCategory: async (req, res) => {
		try {
			const categoriesData = await categories.findAll({
				include: [products],
			});

			const productCountsByCategory = categoriesData.map((category) => {
				const activeProductsCount = category.Products.filter((product) => product.isActive).length;
				const deactivatedProductsCount = category.Products.filter((product) => !product.isActive).length;
				const deletedProductsCount = category.Products.filter((product) => product.isDeleted).length;
				const totalViewCount = category.Products.reduce((total, product) => {
					return total + product.viewCount;
				}, 0);

				return {
					categoryId: category.id,
					categoryName: category.category,
					activeProductsCount,
					deactivatedProductsCount,
					deletedProductsCount,
					totalViewCount,
				};
			});

			res.status(200).send({
				status: 200,
				productCountsByCategory,
			});
		} catch (error) {
			return res.status(500).send({
				status: 500,
				message: "Internal server error.",
				error,
			});
		}
	},
	getProductStatusAverages: async (req, res) => {
		try {
			const categoriesData = await categories.findAll({
				include: [products],
			});

			const totalActiveProductCount = categoriesData.reduce((total, category) => {
				return total + category.Products.filter((product) => product.isActive).length;
			}, 0);

			const totalDeactivatedProductCount = categoriesData.reduce((total, category) => {
				return total + category.Products.filter((product) => !product.isActive).length;
			}, 0);

			const totalDeletedProductCount = categoriesData.reduce((total, category) => {
				return total + category.Products.filter((product) => product.isDeleted).length;
			}, 0);
			const totalViewCount = categoriesData.reduce((total, category) => {
				return (
					total +
					category.Products.reduce((categoryTotal, product) => {
						return categoryTotal + product.viewCount;
					}, 0)
				);
			}, 0);

			const averageActiveProductCount = Math.round(totalActiveProductCount / categoriesData.length);
			const averageDeactivatedProductCount = Math.round(totalDeactivatedProductCount / categoriesData.length);
			const averageDeletedProductCount = Math.round(totalDeletedProductCount / categoriesData.length);
			const averageViewCount = Math.round(totalViewCount / categoriesData.length);

			res.status(200).send({
				status: 200,
				averageActiveProductCount,
				averageDeactivatedProductCount,
				averageDeletedProductCount,
				averageViewCount,
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
