"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
	class Carts extends Model {
		static associate(models) {
			Carts.belongsTo(models.Users);
			Carts.belongsTo(models.Branches);
			Carts.hasMany(models.Cart_items);
		}
	}
	Carts.init(
		{
			status: {
				type: DataTypes.ENUM("ACTIVE", "ABANDONED", "PAID", "COMPLETE"),
				defaultValue: "ACTIVE",
				allowNull: false,
			},
			description: {
				type: DataTypes.STRING,
			},
		},
		{
			sequelize,
			modelName: "Carts",
		}
	);
	return Carts;
};
