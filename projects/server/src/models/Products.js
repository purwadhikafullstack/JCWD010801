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
				otherKey: "BranchId"
			}); // ENABLED: DEPLOY V.3.6
			Products.hasMany(models.Stocks, {
				foreignKey: "ProductId",
			});
			Products.hasMany(models.StockMovements, {
				foreignKey: "ProductId",
			});
			Products.hasMany(models.Discounts, {
				foreignKey: "ProductId",
			});
			Products.hasMany(models.Vouchers, {
				foreignKey: {
					name: "ProductId",
					allowNull: true,
				},
			});
			Products.hasMany(models.Reviews, {
				foreignKey: {
					name: "ProductId",
					allowNull: false,
				},
			});
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
			viewCount: {
				type: DataTypes.INTEGER,
				defaultValue: 0,
			},
			likeCount: {
				type: DataTypes.INTEGER,
				defaultValue: 0,
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
