"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
	class StockMovements extends Model {
		static associate(models) {
			StockMovements.belongsTo(models.Users);
			StockMovements.belongsTo(models.Products, {
				foreignKey: "ProductId",
			});
			StockMovements.belongsTo(models.Branches, {
				foreignKey: "BranchId",
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
			oldValue: {
				type: DataTypes.INTEGER,
				defaultValue: 0,
			},
			newValue: {
				type: DataTypes.INTEGER,
				defaultValue: 0,
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
			isInitialization: {
				type: DataTypes.BOOLEAN,
				defaultValue: false,
			},
			isBranchInitialization: {
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
