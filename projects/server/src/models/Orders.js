"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
	class Orders extends Model {
		static associate(models) {
			Orders.belongsTo(models.Carts);
            Orders.hasMany(models.Order_details);
		}
	}
	Orders.init(
		{
			shipment: {
				type: DataTypes.STRING,
                allowNull: false
			},
			shippingFee: {
				type: DataTypes.INTEGER,
                allowNull: false
			},
			subtotal: {
				type: DataTypes.INTEGER,
                allowNull: false
			},
			tax: {
				type: DataTypes.INTEGER,
                allowNull: false
			},
			discount: {
				type: DataTypes.INTEGER,
                allowNull: false
			},
			total: {
				type: DataTypes.INTEGER,
                allowNull: false
			},
			status: {
				type: DataTypes.ENUM('Waiting payment', 'Pending payment confirmation', 'Processing', 'Sent', 'Received', 'Cancelled'),
                allowNull: false
			},
			paymentProof: {
				type: DataTypes.STRING,
                allowNull: false
			},
		},
		{
			sequelize,
			modelName: "Orders",
		}
	);
	return Orders;
};
