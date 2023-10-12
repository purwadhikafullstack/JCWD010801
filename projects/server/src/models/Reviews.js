"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class Reviews extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			Reviews.belongsTo(models.Users);
			Reviews.belongsTo(models.Products);
		}
	}
	Reviews.init(
		{
			comment: { type: DataTypes.STRING, allowNull: true },
			rating: { type: DataTypes.INTEGER, allowNull: true },
		},
		{
			sequelize,
			modelName: "Reviews",
		}
	);
	return Reviews;
};
