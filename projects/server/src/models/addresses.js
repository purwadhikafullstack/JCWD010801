'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Addresses extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Addresses.belongsTo(models.Users)
    }
  }
  Addresses.init({
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
    isDeleted: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Addresses',
  });
  return Addresses;
};