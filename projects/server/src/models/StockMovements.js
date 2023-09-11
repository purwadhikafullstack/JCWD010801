"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
	class StockMovements extends Model {
		static associate(models) {
			StockMovements.belongsTo(models.Products, {
				foreignKey: "productId",
			});
			StockMovements.belongsTo(models.Branches, {
				foreignKey: "branchId",
			});
		}
	}
	StockMovements.init(
		{
			id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
			},
			change: {
				type: DataTypes.INTEGER,
				defaultValue: 0,
			},
			isAddition: {
				type: DataTypes.BOOLEAN,
				defaultValue: true,
			},
			isAdjustment: {
				type: DataTypes.BOOLEAN,
				defaultValue: false,
			},
		},
		{
			sequelize,
			modelName: "StockMovements",
		}
	);
	return StockMovements;
};
