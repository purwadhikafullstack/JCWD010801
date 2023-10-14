"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
	class Changelogs extends Model {
		static associate(models) {
			Changelogs.belongsTo(models.Users);
			Changelogs.belongsTo(models.Products);
		}
	}
	Changelogs.init(
		{
			field: {
				type: DataTypes.STRING,
			},
			oldValue: {
				type: DataTypes.STRING,
			},
			newValue: {
				type: DataTypes.STRING,
			},
		},
		{
			sequelize,
			modelName: "Changelogs",
		}
	);
	return Changelogs;
};
