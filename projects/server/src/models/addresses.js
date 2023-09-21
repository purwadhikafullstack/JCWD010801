"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class Addresses extends Model {
		static associate(models) {
			Addresses.belongsTo(models.Users);
			Addresses.hasOne(models.Orders);
		}
	}
	Addresses.init(
		{
			label: DataTypes.STRING,
			address: DataTypes.STRING,
			city_id: DataTypes.STRING,
			city: DataTypes.STRING,
			province_id: DataTypes.STRING,
			province: DataTypes.STRING,
			subdistrict: DataTypes.STRING,
			postal_code: DataTypes.STRING,
			lat: DataTypes.FLOAT,
			lng: DataTypes.FLOAT,
			isMain: DataTypes.BOOLEAN,
			isDeleted: DataTypes.BOOLEAN,
		},
		{
			sequelize,
			modelName: "Addresses",
		}
	);
	return Addresses;
};
