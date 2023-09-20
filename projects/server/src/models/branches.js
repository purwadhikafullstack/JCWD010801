"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class Branches extends Model {
		static associate(models) {
			Branches.hasMany(models.Users);
			Branches.belongsToMany(models.Products, {
				through: models.Stocks,
				foreignKey: "BranchId",
			});
		}
	} //! BIMO PROTECT. HM USERS. BTM PRODUCTS ASSOCIATIONS 20 SEPT
	Branches.init(
		{
			name: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			address: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			imgURL: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			longitude: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			latitude: {
				type: DataTypes.STRING,
				allowNull: true,
			},
		},
		{
			sequelize,
			modelName: "Branches",
			timestamps: false,
		}
	);
	return Branches;
};
