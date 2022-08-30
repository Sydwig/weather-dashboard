//global variables
var appid = '485bbc753e29e9770f09ca55c32c6d79'; //had to use Anthony's API key
var searchEl = document.querySelector('#search');
var searchForm = document.querySelector('#searchForm');
var searchedCities = document.querySelector('#searchedCities');

var toJSON = function (response) { //response toJSON coversion
    return response.json();
};

var DisplayWeather = function (data, city) {
    console.log(data);
    var currentEl = document.querySelector('#current');
    var h2El = document.createElement('h2');
    var tempEl = document.createElement('p');
    h2El.textContent = city.name;
    tempEl.textContent = 'TEMP: ' + data.current.temp;
    currentEl.appendChild(h2El);
    currentEl.appendChild(tempEl);
};

var getOneCall = function (city) {
    var oneCall = `https://api.openweathermap.org/data/2.5/onecall?lat=${city.lat}&lon=${city.lon}&appid=${appid}&units=imperial&exclude=hourly,minutely`;
    fetch(oneCall)
        .then(toJSON)
        .then(function (data) {
            DisplayWeather(data, city);
        });
};

var saveToLocalStorage = function (city) { //saves entry to local storage
    var cities = JSON.parse(localStorage.getItem('cities')) || [];
    cities.push(city);
    var data = JSON.stringify(cities);
    localStorage.setItem('cities', data);
    displayButtons();
};

var getGeo = function (locations) {
    var city = locations[0];
    console.log('LAT', city.lat);
    console.log('LON', city.lon);
    saveToLocalStorage(city.name);
    getOneCall(city);
};

var displayButtons = function () {
    var cities = JSON.parse(localStorage.getItem('cities')) || [];
    var showOnlyFiveCities = cities.slice(cities.length - 5);
    searchedCities.innerHTML = null;
    for (var city of showOnlyFiveCities) {
        var buttonEl = document.createElement('button');
        buttonEl.textContent = city;
        buttonEl.className = "btn btn-success mb-3";
        searchedCities.appendChild(buttonEl);
    }
};

var handleCityClick = function (event) {
    event.preventDefault();
    if (event.target.matches('button')) {
        var q = event.target.textContent;
        var geoURL = `http://api.openweathermap.org/geo/1.0/direct?q=${q}&appid=${appid}`;
        fetch(geoURL)
            .then(toJSON)
            .then(getGeo);
    }
};

var runSearch = function(event) {
    event.preventDefault();
    var q = document.querySelector('#q');
    var geoURL = `http://api.openweathermap.org/geo/1.0/direct?q=${q.value}&appid=${appid}`;
    fetch(geoURL)
        .then(toJSON)
        .then(getGeo);
};

searchEl.addEventListener('click', runSearch);
searchedCities.addEventListener('click', handleCityClick);
displayButtons();

