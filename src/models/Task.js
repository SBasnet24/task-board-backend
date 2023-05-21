module.exports = (sequelize, DataTypes) => {
  const League = sequelize.define('task', {
    id: {
      primaryKey: true,
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
    },
    text: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('todo', 'inProgress'),
    },
    position: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });
  return League;
};
