'use strict'

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
// const weatherdata = require('./data/weather.json');
// const moviedata = require('./data/movies.json');

const app = express();

app.use(cors());

const PORT = process.env.PORT;

app.get('/', (req, res, next) => {
  res.status(200).send('Default Route Working');
});

app.get('/weather', async (req, res, next) => {
  try {
    const city = req.query.city;
    const lon = req.query.lon;
    const lat = req.query.lat;
    const url = `https://api.weatherbit.io/v2.0/forecast/daily?city=${city}&lat=${lat}&lon=${lon}&key=${process.env.WEATHER_API_KEY}`;
    const response = await axios.get(url);
    const formattedData = response.data.data.map(forecastitem => new Forecast(forecastitem));
    // throw new Error('We have a problem');
    res.status(200).send(formattedData);
  }
  catch(error){
    next(error);
  }
});

app.get('/movies', async (req, res, next) => {
  try {
    const cityquery = req.query.cityquery;
    const url = `https://api.themoviedb.org/3/search/movie?query=${cityquery}&include_adult=false&language=en-US&page=1&api_key=${process.env.MOVIE_API_KEY}`;
    const response = await axios.get(url);
    const formattedData = response.data.results.map(movieitem => new Movielist(movieitem));
    res.status(200).send(formattedData);
  }
  catch(error){
    next(error);
  }
});

class Forecast{
  constructor(obj){
    this.date = obj.datetime;
    this.description = obj.weather.description;
  }
}

class Movielist{
  constructor(obj){
    this.title = obj.title;
    this.overiew = obj.overview;
    this.release_date = obj.release_date;
    this.rating = obj.vote_average;
    this.poster = obj.poster_path;
  }
}

// Always make 'app.use' the last middleware
app.use((error, req, res, next) => {
  res.status(500).send(error.message);
});

app.listen(PORT, () => console.log(`listening on ${PORT}`));
