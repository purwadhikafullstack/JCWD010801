"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
	class Categories extends Model {
		static associate(models) {
			Categories.hasMany(models.Products);
		}
	}
	Categories.init(
		{
			category: {
				type: DataTypes.STRING,
				unique: true,
			},
			imgURL: DataTypes.STRING,
			isDeleted: {
				type: DataTypes.BOOLEAN,
				defaultValue: false,
			},
		},
		{
			sequelize,
			modelName: "Categories",
			timestamps: false,
		}
	);
	return Categories;
};
