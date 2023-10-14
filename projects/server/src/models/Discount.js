"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
	class Discounts extends Model {
		static associate(models) {
			Discounts.belongsTo(models.Products, {
                foreignKey: "ProductId"
            });
			Discounts.belongsTo(models.Branches, {
                foreignKey: "BranchId"
            });
		}
	}
	Discounts.init(
		{
			type: {
				type: DataTypes.ENUM("Numeric", "Percentage", "Extra"),
				allowNull: false,
			},
			nominal: {
				type: DataTypes.INTEGER,
                allowNull: false,
			},
			availableFrom: {
				type: DataTypes.DATE,
                allowNull: false,
			},
			validUntil: {
				type: DataTypes.DATE,
			},
			isActive: {
				type: DataTypes.BOOLEAN,
				defaultValue: true,
				allowNull: false,
			}
		},
		{
			sequelize,
			modelName: "Discounts",
		}
	);
	return Discounts;
};
