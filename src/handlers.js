const { sequelize, User, Tweet, Like, Follow } = require("./models");

// user handlers
async function createUser(data) {
  const user = await User.create(data);
  return user.toJSON();
}

async function getUserDetails(query) {
  const { username } = query;
  const user = await User.findOne({ where: { username } });
  return user.toJSON();
}

async function getUser(body, res) {
  const { email, password } = body;
  const user = await User.findOne({ where: { email } });
  if (user.password !== password) {
    res.status(401).json({ message: "not authorised" });
    return;
  }
  return user.toJSON();
}

// Tweet Handlers
async function createTweet(data) {
  const tweet = await Tweet.create(data);
  return tweet.toJSON();
}

async function getTweets(reqQuery) {
  const { username, userId, tweetId } = reqQuery;
  let query;
  if (userId) {
    query = { where: { userId } };
  } else if (username) {
    const user = await User.findOne({
      where: { username },
    });
    query = { where: { userId: user.id }, order: [["createdAt", "DESC"]] };
  } else if (tweetId) {
    query = { where: { id: tweetId } };
  } else {
    query = {};
  }

  const tweets = await Tweet.findAll(query);
  return tweets.map((tweet) => tweet.toJSON());
}

async function createLike(body, res) {
  const { tweetId } = body;
  try {
    const t = await sequelize.transaction(async (t) => {
      const like = await Like.create(body, { transaction: t });

      const oldTweet = await Tweet.findOne({ where: { id: tweetId } });

      const likesCount = oldTweet.likesCount + 1;

      const tweet = await Tweet.update(
        { likesCount: likesCount },
        {
          where: { id: tweetId },
        },
        { transaction: t }
      );
      return tweet;
    });
  } catch (error) {
    res.status(404).end();
  }
}

async function getLikes(tweetId) {
  // tweets that user liked
  let query;
  if (tweetId) {
    query = { where: { tweetId } };
  } else {
    query = {};
  }
  // likes for a particular tweet
  const likes = await Like.findAll(query);
  return likes.map((like) => like.toJSON());
}

async function deleteLike(tweetId, userId) {
  // delete the like of a particular tweet of a user
  const like = await Like.destroy({ where: { tweetId, userId } });
  return like;
}

// Follow CRUD

async function createFollow(body) {
  // Follower hanedler and following handler is same for this case
  const follow = await Follow.create(body);
  return follow.toJSON();
}

// get all my followers

async function getFollows(params) {
  const { userId, followerId } = params;
  // Follower hanedler and following handler is same for this case
  let query;
  if (userId) {
    query = { where: { userId } };
  } else if (followerId) {
    query = { where: { followerId: followerId } };
  } else {
    query = {};
  }

  const follow = await Follow.findAll(query);
  return follow.map((follow) => follow.toJSON());
}

// delete a follow
// delete a following

module.exports = {
  createUser,
  getUser,
  createTweet,
  getTweets,
  createLike,
  getLikes,
  deleteLike,
  createFollow,
  getFollows,
  getUserDetails,
};
