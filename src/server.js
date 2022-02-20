// if (process.env.NODE_ENV !== 'production') {
  // }
  require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { generateData } = require('./mockData');

// Handler functions
const {
  createUser,
  getUser,
  createTweet,
  getTweet,
  getTweets,
  createLike,
  getLikes,
  deleteLike,
  createFollow,
  getFollows,
  getUserDetails,
} = require('./handlers');

const PORT = 8000;

//Middlewares
const app = express();
app.use(cors());

app.use(express.json());

// generateData();

// CRUD for User
app.post('/signup', async (req, res) => {
  const user = await createUser(req.body, res);
  res.status(201).json(user);
});

app.post('/login', async (req, res) => {
  console.log(req.body);
  const login = await getUser(req.body, res);
  res.json(login);
});

app.get('/user', async (req, res) => {
  const user = await getUserDetails(req.query);
  res.json(user);
});

// CRUD for tweet
app.post('/tweet', async (req, res) => {
  const tweet = await createTweet(req.body);
  res.status(201).json(tweet);
});

app.get('/tweets', async (req, res) => {
  const tweets = await getTweets(req.query);
  res.json(tweets);
});

app.get('/tweet', async (req, res) => {
  try {
    const tweet = await getTweet(req.query.params.id);
    res.json(tweet);
  } catch (error) {
    res.status(400).json({ message: 'Bad Request', error });
  }
});

// CRUD for Like

app.post('/like', async (req, res) => {
  try {
    const like = await createLike(req.body, res);
    res.status(201).json(like);
  } catch (error) {
    res.status(400).json({ message: 'Bad Request', error });
  }
});

app.get('/like', async (req, res) => {
  try {
    const like = await getLikes(req.query.tweetId);
    res.status(201).json(like);
  } catch (error) {
    res.status(400).json({ message: 'Bad Request', error });
  }
});

app.delete('/like', async (req, res) => {
  const { tweetId, userId } = req.body;
  try {
    const like = await deleteLike(tweetId, userId);
    if (like) res.status(201).json(like);
  } catch (error) {
    res.status(400).json({ message: 'Bad Request', error });
  }
});

// CRUD for follow

app.post('/follow', async (req, res) => {
  try {
    const follow = await createFollow(req.body, res);
    console.log(follow);
    res.status(201).json({ message: 'new followers created' });
  } catch (error) {
    res.status(400).json({ message: 'Bad Request', error });
  }
});

app.get('/follow', async (req, res) => {
  try {
    const follows = await getFollows(req.query);
    res.status(201).json(follows);
  } catch (error) {
    res.status(400).json({ message: 'Bad Request', error });
  }
});

app.listen(PORT, () => {
  console.log(`Server started on ${PORT}`);
});
