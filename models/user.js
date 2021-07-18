'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ TwitchNotification }) {
      this.hasMany(TwitchNotification, { onDelete: 'CASCADE' });
    }
  };
  User.init({
    username: DataTypes.STRING,
    discordId: {
      type: DataTypes.STRING,
      unique: true
    }
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};