"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class Roles extends Model {
		static associate(models) {
			Roles.hasOne(models.Users);
		}
	}
	Roles.init(
		{
			access: { type: DataTypes.STRING },
		},
		{
			sequelize,
			modelName: "Roles",
			timestamps: false,
		}
	);
	return Roles;
};
