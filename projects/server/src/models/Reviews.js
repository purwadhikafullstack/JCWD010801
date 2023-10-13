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
			comment: {
				type: DataTypes.STRING(500),
				allowNull: true,
			},
			rating: {
				type: DataTypes.INTEGER,
				allowNull: false,
				validate: {
					isNumeric: true,
					min: 0,
					max: 5,
				},
			},
			qty: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			invoiceNumber: {
				type: DataTypes.STRING,
				allowNull: false,
			},
		},
		{
			sequelize,
			modelName: "Reviews",
		}
	);
	return Reviews;
};
