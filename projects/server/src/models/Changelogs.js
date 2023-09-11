"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
	class Changelogs extends Model {
		static associate(models) {
            //admin id
            //products.
		}
	}
	Changelogs.init(
		{
			field: {
				type: DataTypes.STRING
			},
			oldValue: {
				type: DataTypes.STRING
			},
			newValue: {
				type: DataTypes.STRING
			},
		},
		{
			sequelize,
			modelName: "Changelogs",
		}
	);
	return Changelogs;
};
