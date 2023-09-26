"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
	class Orders extends Model {
		static associate(models) {
			Orders.belongsTo(models.Carts);
			Orders.hasMany(models.Order_details);
			Orders.belongsTo(models.Addresses);
		}
	}
	Orders.init(
		{
			shipment: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			shipmentMethod: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			etd: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			shippingFee: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			subtotal: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			tax: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			discount: {
				type: DataTypes.INTEGER,
			},
			total: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			status: {
				type: DataTypes.ENUM(
					"Waiting payment",
					"Pending payment confirmation",
					"Processing",
					"Sent",
					"Confirmed",
					"Cancelled"
				),
				allowNull: false,
			},
			paymentProof: {
				type: DataTypes.STRING,
			},
			invoice: {
				type: DataTypes.STRING,
			},
		},
		{
			sequelize,
			modelName: "Orders",
		}
	);
	return Orders;
};
