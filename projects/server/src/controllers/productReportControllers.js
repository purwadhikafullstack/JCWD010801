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
			console.error(error);
			return res.status(500).send({
				error,
				status: 500,
				message: "Internal server error.",
			});
		}
	},
};
