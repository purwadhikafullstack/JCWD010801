"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class Branches extends Model {
		static associate(models) {
			Branches.hasMany(models.Users);
			Branches.hasMany(models.StockMovements);
			Branches.belongsToMany(models.Products, {
				through: models.Stocks,
			}); // Try to enable again in deploy v.3.0.
			Branches.hasMany(models.Discounts);
			Branches.hasMany(models.Vouchers);
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
			lng: {
				type: DataTypes.DECIMAL(10, 6),
				allowNull: true,
			},
			lat: {
				type: DataTypes.DECIMAL(10, 6),
				allowNull: true,
			},
			city_id: DataTypes.STRING,
			city: DataTypes.STRING,
			province_id: DataTypes.STRING,
			province: DataTypes.STRING,
			northeast_lat: DataTypes.DECIMAL(10, 6),
			northeast_lng: DataTypes.DECIMAL(10, 6),
			southwest_lat: DataTypes.DECIMAL(10, 6),
			southwest_lng: DataTypes.DECIMAL(10, 6),
		},
		{
			sequelize,
			modelName: "Branches",
			timestamps: false,
		}
	);
	return Branches;
};
