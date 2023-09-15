"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
	class Products extends Model {
		static associate(models) {
			Products.belongsTo(models.Categories, {
				foreignKey: {
					allowNull: false,
				},
			});
			Products.belongsToMany(models.Branches, {
				through: models.Stocks,
				foreignKey: "productId",
			});
			Products.belongsToMany(models.Branches, {
				through: models.StockMovements,
				foreignKey: "productId",
			});
			Products.hasMany(models.Stocks, {
				foreignKey: "productId",
			});
			// Products.hasMany(models.CartItems);
			// Products.hasMany(models.Sales, {
			//   foreignKey: 'productId'
			// });
		}
	}
	Products.init(
		{
			productName: {
				type: DataTypes.STRING,
				unique: true,
			},
			price: {
				type: DataTypes.BIGINT,
				allowNull: false,
			},
			imgURL: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			description: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			aggregateStock: {
				type: DataTypes.INTEGER,
				defaultValue: 0,
				allowNull: true,
			},
			weight: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			isActive: {
				type: DataTypes.BOOLEAN,
				defaultValue: true,
			},
			isDeleted: {
				type: DataTypes.BOOLEAN,
				defaultValue: false,
			},
		},
		{
			sequelize,
			modelName: "Products",
		}
	);
	return Products;
};
