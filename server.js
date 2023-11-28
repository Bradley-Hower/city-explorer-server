'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const getWeather = require('./modules/weather');
const getMovies = require('./modules/movies');
const getRestaurants = require('./modules/restaurants');

const app = express();
app.use(cors());
const PORT = process.env.PORT;

app.get('/', (req, res, next) => {
  res.status(200).send('Default Route Working');
});

app.get('/weather', getWeather);
app.get('/movies', getMovies);
app.get('/restaurants', getRestaurants);

// Always make 'app.use' the last middleware
app.use((error, req, res, next) => {
  res.status(500).send(error.message);
});

app.listen(PORT, () => console.log(`listening on ${PORT}`));
