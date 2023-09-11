"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
	class Cart_items extends Model {
		static associate(models) {
			Cart_items.belongsTo(models.Carts);
            Cart_items.belongsTo(models.Products);
		}
	}
	Cart_items.init(
		{
			quantity: {
				type: DataTypes.INTEGER,
                allowNull: false
			}
		},
		{
			sequelize,
			modelName: "Cart_items",
			timestamps: false,
		}
	);
	return Cart_items;
};
