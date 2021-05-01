const { Sequelize, DataTypes } = require('sequelize');
const { prettify } = require('sql-log-prettifier');

const sequelize = new Sequelize('twitter', 'postgres', '1234', {
  host: 'localhost',
  dialect: 'postgres',
  logging: function (unformattedAndUglySql) {
    const prettifiedSQL = prettify(unformattedAndUglySql);
    console.log(prettifiedSQL);
  },
});

const User = sequelize.define('user', {
  // Model attributes are defined here
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

const Tweet = sequelize.define('tweet', {
  text: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  parentTweetId: {
    type: DataTypes.INTEGER,
  },
});

User.hasMany(Tweet);
Tweet.belongsTo(User);

const Like = sequelize.define('like', {});

Tweet.hasMany(Like);
Like.belongsTo(Tweet);

User.hasMany(Like);
Like.belongsTo(User);

const Follow = sequelize.define('follow', {});

User.hasMany(Follow, {
  foreignKey: 'userId',
});
Follow.belongsTo(User, {
  foreignKey: 'userId',
});

User.hasMany(Follow, {
  foreignKey: 'followerId',
});
Follow.belongsTo(User, {
  foreignKey: 'followerId',
});

async function connection() {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
    console.log('All models were synchronized successfully.');
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

connection();

module.exports = { sequelize, User, Tweet, Like, Follow };
