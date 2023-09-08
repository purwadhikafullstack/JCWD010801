"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
	class Stocks extends Model {
		static associate(models) {
			Stocks.belongsTo(models.Products, {
				foreignKey: "productId",
			});
			Stocks.belongsTo(models.Branches, {
				foreignKey: "branchId",
			});
		}
	}
	Stocks.init(
		{
			branchStock: {
				type: DataTypes.INTEGER,
				defaultValue: 0,
			},
		},
		{
			sequelize,
			modelName: "Stocks",
		}
	);
	return Stocks;
};
