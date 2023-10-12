"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
	class Notifications extends Model {
		static associate(models) {
			Notifications.belongsTo(models.Users, {
                foreignKey: "UserId"
            });
		}
	}
	Notifications.init(
		{
			type: {
				type: DataTypes.ENUM("Transaction", "Discount"),
				allowNull: false,
			},
			name: {
				type: DataTypes.STRING,
                allowNull: false,
			},
			isRead: {
				type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
			},
            description: {
                type: DataTypes.STRING(500),
                allowNull: false
            },
            promoCode: {
                type: DataTypes.STRING,
                allowNull: true
            }
		},
		{
			sequelize,
			modelName: "Notifications",
		}
	);
	return Notifications;
};
