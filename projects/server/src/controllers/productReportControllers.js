const db = require("../models");
const categories = db.Categories;
const products = db.Products;
const changelogs = db.Changelogs;
const stocks = db.Stocks;
const stockMovements = db.StockMovements;
const { Sequelize, Op } = require("sequelize");

module.exports = {
    getProduct: async (req, res) => {
		try {
			const { id } = req.params;
			const { BranchId } = req.query;

			const joinCondition = {
				model: stocks,
				where: { BranchId: parseInt(BranchId) || 1 },
				required: false,
			};

			const result = await products.findOne({
				where: {
					id: id,
				},
				include: [joinCondition],
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

};
