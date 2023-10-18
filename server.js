'use strict'

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const weatherdata = require('./data/weather.json');

const app = express();

app.use(cors());

const PORT = process.env.PORT || 3002;

app.get('/', (req, res, next) => {
  res.status(200).send('Default Route Working');
});

app.get('/weather', (req, res, next) => {
  try {
    const type = req.query.type;
    const lon = req.query.loninput;
    const lat = req.query.latinput;
    const test1 = weatherdata.filter(city => city.city_name === type);
    const test2 = test1.filter(longitude => longitude.lon === lon);
    const test3 = test2.find(latitude => latitude.lat === lat);
    const formattedData = test3.data.map(forecastitem => new Forecast(forecastitem));
    // throw new Error('We have a problem');
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

// Always make 'app.use' the last middleware
app.use((error, req, res, next) => {
  res.status(500).send(error.message);
});

app.listen(PORT, () => console.log(`listening on ${PORT}`));

