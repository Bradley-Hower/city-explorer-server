'use strict';
const axios = require('axios');

function getMovies(req, res, next){
  const cityquery = req.query.cityquery;
  const url = `https://api.themoviedb.org/3/search/movie?query=${cityquery}&include_adult=false&language=en-US&page=1&api_key=${process.env.MOVIE_API_KEY}`;
  axios.get(url)
    .then(response => response.data.results.map(movieitem => new Movielist(movieitem)))
    .then(formattedData => res.status(200).send(formattedData))
    .catch(err => next(err));
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
