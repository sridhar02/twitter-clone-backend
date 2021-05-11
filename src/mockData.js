const faker = require('faker');
const { User, Tweet, Like, Follow } = require('./models');

async function createUsers() {
  const user = await User.create({
    name: faker.name.findName(),
    email: faker.internet.email(),
    username: faker.internet.userName(),
    password: faker.internet.password(),
  });
  return user;
}

async function createTweets() {
  const totalUserCount = await User.count({});
  const randomUserId = Math.floor(Math.random() * totalUserCount);
  const tweet = await Tweet.create({
    text: faker.lorem.text(),
    userId: randomUserId,
  });

  return tweet;
}

function generateData() {
  setInterval(() => {
    // createUsers();
    createTweets();
  }, 50000);
}

module.exports = {
  generateData,
};
