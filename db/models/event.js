'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Event extends Model {
    static associate(models) {
      Event.associate = function(models) {
        Event.hasMany(models.Rsvp);
        Event.belongsTo(models.User);
      };
    }
  }
  Event.init({
    title: DataTypes.STRING,
    desc: DataTypes.TEXT,
    imgUrl: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Event',
  });
  return Event;
};
