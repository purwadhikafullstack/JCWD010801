"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class Branches extends Model {
		static associate(models) {
			Branches.hasMany(models.Users);
			Branches.belongsToMany(models.Products, {
				through: models.Stocks,
				foreignKey: "branchId",
			});
			Branches.belongsToMany(models.Products, {
				through: models.StockMovements,
				foreignKey: "branchId",
			});
		}
	}
	Branches.init(
		{
			name: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			address: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			imgURL: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			longitude: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			latitude: {
				type: DataTypes.STRING,
				allowNull: true,
			},
		},
		{
			sequelize,
			modelName: "Branches",
			timestamps: false,
		}
	);
	return Branches;
};
