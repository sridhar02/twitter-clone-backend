const { User, Tweet } = require('./models');

// user handlers
async function createUser(data) {
  const user = await User.create(data);
  return user.toJSON();
}

async function getUser(id) {
  const users = await User.findOne({ where: { id: id } });
  return users.toJSON();
}

// Tweet Handlers
async function getAllTweets() {
  const tweets = await Tweet.findAll();
  return tweets.map((tweet) => tweet.toJSON());
}

async function getTweet(id) {
  const tweet = await Tweet.findOne({ where: { id: id } });
  return tweet.toJSON();
}

async function createTweet(data) {
  const tweet = await Tweet.create(data);
  return tweet.toJSON();
}

async function getTweets(userId) {
  let query;
  if (userId) {
    query = { where: { userId } };
  } else {
    query = {};
  }
  const tweets = await Tweet.findAll(query);
  return tweets.map((tweet) => tweet.toJSON());
}

module.exports = {
  createUser,
  getUser,
  createTweet,
  getTweet,
  getAllTweets,
  getTweets,
};
