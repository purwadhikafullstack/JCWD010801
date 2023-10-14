"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class Tokens extends Model {
		static associate(models) {}
	}
	Tokens.init(
		{
			token: DataTypes.STRING,
		},
		{
			sequelize,
			modelName: "Tokens",
		}
	);
	return Tokens;
};
