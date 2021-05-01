const express = require('express');

// Handler functions
const {
  createUser,
  getUser,
  createTweet,
  getTweet,
  getTweets,
} = require('./handlers');

const PORT = 8000;

//Middlewares
const app = express();

app.use(express.json());

// CRUD for User
app.post('/user', async (req, res) => {
  const user = await createUser(req.body);
  res.status(201).json(user);
});

app.get('/user/:id', async (req, res) => {
  const user = await getUser(req.params.id);
  res.json(user);
});

// CRUD for tweet
app.post('/tweet', async (req, res) => {
  const tweet = await createTweet(req.body);
  res.status(201).json(tweet);
});

app.get('/tweets', async (req, res) => {
  const tweets = await getTweets(req.query.userId);
  res.json(tweets);
});

app.get('/tweet/:id', async (req, res) => {
  const tweet = await getTweet(req.params.id);
  res.json(tweet);
});

app.listen(PORT, () => {
  console.log(`Server started on ${PORT}`);
});
