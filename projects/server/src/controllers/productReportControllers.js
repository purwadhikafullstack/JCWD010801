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
			const { productName, BranchId = null, startDate = null, endDate = null, UserId = null } = req.query;

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

			const filterSales = {
				ProductId: product.id,
				isAddition: false,
				isAdjustment: false,
				isInitialization: false,
				isBranchInitialization: false,
			};

			const filterAdjustments = {
				ProductId: product.id,
				isAdjustment: true,
				isInitialization: false,
				isBranchInitialization: false,
			};

			if (startDate && endDate) {
				filterSales.createdAt = {
					[Op.between]: [new Date(startDate + " 00:00:00"), new Date(endDate + " 23:59:59")],
				};
				filterAdjustments.createdAt = {
					[Op.between]: [new Date(startDate + " 00:00:00"), new Date(endDate + " 23:59:59")],
				};
			} else if (startDate || endDate) {
				if (startDate) {
					filterSales.createdAt = {
						[Op.gte]: new Date(startDate + " 00:00:00"),
					};
					filterAdjustments.createdAt = {
						[Op.gte]: new Date(startDate + " 00:00:00"),
					};
				}

				if (endDate) {
					filterSales.createdAt = {
						[Op.lte]: new Date(endDate + " 23:59:59"),
					};
					filterAdjustments.createdAt = {
						[Op.lte]: new Date(endDate + " 23:59:59"),
					};
				}
			}

			if (BranchId) {
				filterSales.BranchId = BranchId;
				filterAdjustments.BranchId = BranchId;
			}

			if (UserId) {
				filterSales.UserId = UserId;
				filterAdjustments.UserId = UserId;
			}

			const initialization = await stockMovements.findOne({
				where: {
					ProductId: product.id,
					isAddition: true,
					isAdjustment: false,
					isInitialization: true,
					isBranchInitialization: false,
				},
			});

			const branchInitializations = await stockMovements.findAll({
				where: {
					ProductId: product.id,
					isAddition: true,
					isAdjustment: false,
					isInitialization: false,
					isBranchInitialization: true,
				},
			});

			const salesHistory = await stockMovements.findAll({
				where: filterSales,
			});

			const adjustmentHistory = await stockMovements.findAll({
				where: filterAdjustments,
			});

			res.status(200).send({
				status: 200,
				product_details: product,
				initialization: initialization,
				branch_inititalizations: branchInitializations,
				sales_history: salesHistory,
				adjustment_history: adjustmentHistory,
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

				return {
					categoryId: category.id,
					categoryName: category.category,
					activeProductsCount,
					deactivatedProductsCount,
					deletedProductsCount
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

			const averageActiveProductCount = Math.round(totalActiveProductCount / categoriesData.length);
			const averageDeactivatedProductCount = Math.round(totalDeactivatedProductCount / categoriesData.length);
			const averageDeletedProductCount = Math.round(totalDeletedProductCount / categoriesData.length);

			res.status(200).send({
				status: 200,
				averageActiveProductCount,
				averageDeactivatedProductCount,
				averageDeletedProductCount
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
