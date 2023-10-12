"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
	class Vouchers extends Model {
		static associate(models) {
			Vouchers.belongsTo(models.Products, {
                foreignKey: {
                    name: "ProductId",
                    allowNull: true
                }
            });
			Vouchers.belongsToMany(models.Users, {
                through: "User_vouchers",
                foreignKey: "VoucherId"
            });
            Vouchers.belongsTo(models.Branches, {
                foreignKey: {
					name: "BranchId",
					allowNull: true
				}
            });
		}
	}
	Vouchers.init(
		{
            name: {
				type: DataTypes.STRING,
                allowNull: false
			},
			code: {
				type: DataTypes.STRING,
                allowNull: false
			},
			type: {
				type: DataTypes.ENUM("Single item", "Total purchase", "Shipment"),
				allowNull: false,
			},
			isPercentage: {
				type: DataTypes.BOOLEAN,
                defaultValue: false,
				allowNull: false,
			},
			nominal: {
				type: DataTypes.INTEGER,
                allowNull: false,
			},
			minimumPayment: {
				type: DataTypes.INTEGER,
                defaultValue: 0,
                allowNull: false,
			},
			maximumDiscount: {
				type: DataTypes.INTEGER,
                allowNull: false,
			},
			availableFrom: {
				type: DataTypes.DATE,
                allowNull: false,
			},
			validUntil: {
				type: DataTypes.DATE,
                allowNull: false,
			},
            amountPerRedeem: {
                type: DataTypes.INTEGER,
                defaultValue: 3,
                allowNull: false,
            }
		},
		{
			sequelize,
			modelName: "Vouchers",
		}
	);
	return Vouchers;
};
