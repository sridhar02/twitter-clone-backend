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

// User Modal
const User = sequelize.define(
  'user',
  {
    // Model attributes are defined here
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    profileImage: {
      type: DataTypes.STRING,
    },
    followersCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    followingCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    defaultScope: {
      attributes: {
        exclude: "password",
      },
    },
  }
);

const Tweet = sequelize.define('tweet', {
  text: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  parentTweetId: {
    type: DataTypes.INTEGER,
  },
  commentsCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  likesCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  retweetsCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
});

User.hasMany(Tweet);
Tweet.belongsTo(User);

//Like Model
const Like = sequelize.define('like', {});

Tweet.hasMany(Like);
Like.belongsTo(Tweet);

User.hasMany(Like);
Like.belongsTo(User);

// Follow Model
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

// Token Model
const Token = sequelize.define('token', {
  secret: {
    type: DataTypes.UUID,
    allowNull: false,
    defaultValue: Sequelize.UUIDV4,
  },
});

User.hasMany(Token);
Token.belongsTo(User);

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

module.exports = { sequelize, User, Tweet, Like, Follow, Token };
