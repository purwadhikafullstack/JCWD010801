"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class Users extends Model {
		static associate(models) {
			Users.belongsTo(models.Roles);
			Users.belongsTo(models.Branches);
			Users.hasMany(models.Addresses);
			Users.hasMany(models.Carts);
			Users.hasMany(models.Changelogs);
			Users.hasMany(models.Notifications);
			Users.hasMany(models.Reviews);
			Users.belongsToMany(models.Vouchers, {
				through: "User_vouchers",
				foreignKey: {
					name: "UserId",
					allowNull: true,
				},
			});
			// name: 'SequelizeDatabaseError',
			// server:parent: Error: Column 'UserId' cannot be NOT NULL: needed in a foreign key constraint 'User_vouchers_ibfk_1' SET NULL
			// Users.hasMany(models.User_vouchers, {
			//     foreignKey: "UserId"
			// });
		}
	}
	Users.init(
		{
			firstName: { type: DataTypes.STRING, allowNull: false },
			lastName: { type: DataTypes.STRING, allowNull: false },
			username: { type: DataTypes.STRING, allowNull: false },
			email: { type: DataTypes.STRING, allowNull: false, unique: true },
			phone: { type: DataTypes.STRING, allowNull: false },
			password: { type: DataTypes.STRING, allowNull: false },
			gender: DataTypes.STRING,
			birthDate: DataTypes.DATEONLY,
			avatar: DataTypes.STRING,
			isVerified: { type: DataTypes.BOOLEAN, defaultValue: false },
			isDeleted: { type: DataTypes.BOOLEAN, defaultValue: false },
			referralCode: DataTypes.STRING,
		},
		{
			sequelize,
			modelName: "Users",
		}
	);
	return Users;
};
