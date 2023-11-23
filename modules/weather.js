'use strict';
const axios = require('axios');

function getWeather(req, res, next){
  const city = req.query.city;
  const lat = req.query.lat;
  const lon = req.query.lon;
  const url = `https://api.weatherbit.io/v2.0/forecast/daily?city=${city}&lat=${lat}&lon=${lon}&key=${process.env.WEATHER_API_KEY}`;
  axios.get(url)
    .then(response => response.data.data.map(forecastitem => new Forecast(forecastitem)))
    .then(formattedData => res.status(200).send(formattedData))
    .catch(err => next(err));
}

class Forecast{
  constructor(obj){
    this.date = obj.datetime;
    this.description = obj.weather.description;
  }
}

module.exports = getWeather;
