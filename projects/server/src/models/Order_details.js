"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
	class Order_details extends Model {
		static associate(models) {
			Order_details.belongsTo(models.Orders);
            Order_details.belongsTo(models.Products);
		}
	}
	Order_details.init(
		{
			quantity: {
				type: DataTypes.INTEGER,
                allowNull: false
			}
		},
		{
			sequelize,
			modelName: "Order_details",
			timestamps: false,
		}
	);
	return Order_details;
};
