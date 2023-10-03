"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class Branches extends Model {
		static associate(models) {
			Branches.hasMany(models.Users);
			Branches.belongsToMany(models.Products, {
				through: models.Stocks,
				foreignKey: "BranchId",
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
			lng: {
				type: DataTypes.FLOAT,
				allowNull: true,
			},
			lat: {
				type: DataTypes.FLOAT,
				allowNull: true,
			},
			city_id: DataTypes.STRING,
			city: DataTypes.STRING,
			province_id: DataTypes.STRING,
			province: DataTypes.STRING,
			northeast_lat: DataTypes.FLOAT,
			northeast_lng: DataTypes.FLOAT,
			southwest_lat: DataTypes.FLOAT,
			southwest_lng: DataTypes.FLOAT,
		},
		{
			sequelize,
			modelName: "Branches",
			timestamps: false,
		}
	);
	return Branches;
};
