'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Branches extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Branches.hasOne(models.User)
    }
  }
  Branches.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: true
    },
    logitude: {
      type: DataTypes.STRING,
      allowNull: true
    },
    latitude: {
      type: DataTypes.STRING,
      allowNull: true
    },
  }, {
    sequelize,
    modelName: 'Branches',
    timestamps: false
  });
  return Branches;
};