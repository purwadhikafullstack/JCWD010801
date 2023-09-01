'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Roles extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Roles.hasOne(models.User)
    }
  }
  Roles.init({
    access: { type: DataTypes.STRING }
  }, {
    sequelize,
    modelName: 'Roles',
    timestamps: false
  });
  return Roles;
};