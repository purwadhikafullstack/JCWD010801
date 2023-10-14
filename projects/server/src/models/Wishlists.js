"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
	class Wishlists extends Model {
		static associate(models) {
			Wishlists.belongsTo(models.Users, {
				foreignKey: "UserId",
			});
			Wishlists.belongsTo(models.Products, {
				foreignKey: "ProductId",
			});
		}
	}
	Wishlists.init(
		{
			isLiked: {
				type: DataTypes.BOOLEAN,
				defaultValue: false,
			},
		},
		{
			sequelize,
			modelName: "Wishlists",
		}
	);
	return Wishlists;
};
