"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class Reviews extends Model {
		static associate(models) {
			Reviews.belongsTo(models.Users);
			Reviews.belongsTo(models.Products);
		}
	}
	Reviews.init(
		{
			comment: { type: DataTypes.STRING(500), allowNull: true },
			rating: { type: DataTypes.INTEGER, allowNull: true },
		},
		{
			sequelize,
			modelName: "Reviews",
		}
	);
	return Reviews;
};
