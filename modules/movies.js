'use strict';
const axios = require('axios');
const cache = require('./cache');

function getMovies(req, res, next){
  const cityquery = req.query.cityquery;
  const key = 'movies ' + cityquery;
  const url = `https://api.themoviedb.org/3/search/movie?query=${cityquery}&include_adult=false&language=en-US&page=1&api_key=${process.env.MOVIE_API_KEY}`;
  
  if (cache[key] && (Date.now() - cache[key].timestamp < 600000)){
    console.log('Cache hit - pulling in cache data');
    res.status(200).send(cache[key].data);
  }
  else {
    console.log('Cache miss - submitting new request');
    axios.get(url)
      .then(response => response.data.results.map(movieitem => new Movielist(movieitem)))
      .then(formattedData => {
        cache[key] = {};
        cache[key].data = formattedData;
        cache[key].timestamp = Date.now();
        res.status(200).send(formattedData);
      })
      .catch(err => next(err));
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

module.exports = getMovies;
