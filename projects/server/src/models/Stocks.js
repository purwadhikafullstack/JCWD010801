"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
	class Stocks extends Model {
		static associate(models) {
			Stocks.belongsTo(models.Products);
			Stocks.belongsTo(models.Branches, {
				foreignKey: "BranchId",
				as: "BranchStocks"
			});
		}
	}
	Stocks.init(
		{
			currentStock: {
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
