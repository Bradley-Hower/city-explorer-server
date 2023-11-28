'use strict';
const axios = require('axios');
const cache = require('./cache');

function getWeather(req, res, next){
  const city = req.query.city;
  const lat = req.query.lat;
  const lon = req.query.lon;
  const key = 'weather ' + city + lat + lon;
  const url = `https://api.weatherbit.io/v2.0/forecast/daily?city=${city}&lat=${lat}&lon=${lon}&key=${process.env.WEATHER_API_KEY}`;

  if (cache[key] && (Date.now() - cache[key].timestamp < 600000)){
    console.log('Cache hit - pulling in cache data');
    res.status(200).send(cache[key].data);
    // res.status(200).write(cache[key].data.data);
    // res.write(cache[key].data.timestamp);
    // res.end();
  }
  else {
    console.log('Cache miss - submitting new request');
    axios.get(url)
      .then(response => response.data.data.map(forecastitem => new Forecast(forecastitem)))
      .then(formattedData => {
        cache[key] = {};
        cache[key].data = formattedData;
        cache[key].timestamp = Date.now();
        res.status(200).send(formattedData);
      })
      .catch(err => next(err));
  }
}

class Forecast{
  constructor(day){
    this.date = day.datetime;
    this.description = day.weather.description;
  }
}

module.exports = getWeather;
