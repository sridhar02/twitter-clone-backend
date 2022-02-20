const { faker } = require('@faker-js/faker');
const { User, Tweet, Like, Follow } = require('./models');
const { createUser } = require('./handlers.js');

async function createUsers() {
  const data = {
    name: faker.name.findName(),
    email: faker.internet.email(),
    username: faker.internet.userName(),
    password: faker.internet.password(),
  };
  const user = await createUser(data);
  return user;
}

async function createTweets() {
  const totalUserCount = await User.count({});
  const randomUserId = Math.floor(Math.random() * totalUserCount);
  // const randomUserId = 114;
  const tweet = await Tweet.create({
    text: faker.lorem.paragraph(),
    userId: randomUserId,
  });

  return tweet;
}

function generateData() {
  setInterval(() => {
    createUsers();
    // createTweets();  
  }, 500);
}

module.exports = {
  generateData,
};
