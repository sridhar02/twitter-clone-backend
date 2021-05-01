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

const Like = sequelize.define('like', {
  tweetId: {
    type: DataTypes.INTEGER,
  },
  userId: {
    type: DataTypes.INTEGER,
  },
});

const Follow = sequelize.define('follow', {});

Tweet.hasMany(Like);
Like.belongsTo(Tweet);

User.hasMany(Tweet);
Tweet.belongsTo(User);

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
    await sequelize.sync({ force: true });
    console.log('All models were synchronized successfully.');
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

connection();

module.exports = { sequelize, User, Tweet };
