"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
	class User_vouchers extends Model {
		static associate(models) {
			User_vouchers.belongsTo(models.Users, {
				foreignKey: {
					name: "UserId",
					allowNull: true,
				},
			});
			User_vouchers.belongsTo(models.Vouchers, {
				foreignKey: {
					name: "VoucherId",
					allowNull: true,
				},
			});
		}
	}
	User_vouchers.init(
		{
			amount: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
		},
		{
			sequelize,
			modelName: "User_vouchers",
		}
	);
	return User_vouchers;
};
