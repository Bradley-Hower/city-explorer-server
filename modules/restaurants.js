'use strict';
const axios = require('axios');
const cache = require('./cache');

function getRestaurants(req, res, next){
  const cityquery = req.query.cityquery;
  const key = 'restaurants ' + cityquery;
  const url = `https://api.yelp.com/v3/businesses/search?location=${cityquery}&term=restaurants&sort_by=best_match&limit=20`;

  if (cache[key] && (Date.now() - cache[key].timestamp < 3600000)){
    console.log('Cache hit - pulling in cache data');
    res.status(200).send(cache[key].data);
  }
  else {
    console.log('Cache miss - submitting new request');
    axios.get(url, {
      headers: {
        Authorization: 'Bearer ' + `${process.env.YELP_API_KEY}`}
    })
      .then(response => response.data.businesses.map(place => new Restaurant(place)))
      .then(formattedData => {
        cache[key] = {};
        cache[key].data = formattedData;
        cache[key].timestamp = Date.now();
        res.status(200).send(formattedData);
      })
      .catch(err => next(err));
  }
}

class Restaurant{
  constructor(business){
    this.name = business.name;
    this.image_url = business.image_url;
    this.price = business.price;
    this.rating = business.rating;
    this.url = business.url;
  }
}
module.exports = getRestaurants;
