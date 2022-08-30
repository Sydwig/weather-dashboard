var appId = '2bc993b295d6552601151ddd85bc5a4a';
var q = 'Chicago'; //this will be an input soon
var geoURL = `http://api.openweathermap.org/geo/1.0/direct?q=${q}&appid=${appId}`; //open weather API here

fetch(geoURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (locations) {
      console.log(locations);
      var city = locations[0];
      console.log('LAT', city.lat);
      console.log('LON', city.lon);
    });
    