'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Products extends Model {
    static associate(models) {
      Products.belongsTo(models.Categories, {
        foreignKey: {
          allowNull: false
        }
      });
      // Products.hasMany(models.Sales, {
      //   foreignKey: 'productId'
      // });
      // Products.hasMany(models.CartItems);
    }
  }
  Products.init({
    productName: {
      type: DataTypes.STRING,
      unique: true
    },
    price: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    imgURL: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false
    },
    stock: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
      allowNull: false
    },
    weight: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    isDeleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    sequelize,
    modelName: 'Products',
  });
  return Products;
};