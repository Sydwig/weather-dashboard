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
    var fiveDayEl = document.querySelector('#fiveDay')
    var currentEl = document.querySelector('#current');
    var h2El = document.createElement('h2');
    var tempEl = document.createElement('p');
    h2El.textContent = city.name;
    tempEl.textContent = 'TEMP: ' + data.current.temp;
    currentEl.appendChild(h2El);
    currentEl.appendChild(tempEl);
    var fiveDay = data.daily.slice(1, 6);
    fiveDayEl.innerHTML = null;
    for (var day of fiveDay) {
        var date = new Date(1661878800 * 1000).toLocaleDateString();
        var temp = day.temp.day;
        var colEl = document.createElement('div');
        colEl.className = "col-12 col-md";
        var cardEl = document.createElement('div');
        cardEl.className = "card p-3 m-3";
        var dateEl = document.createElement('p');
        var tempEl = document.createElement('p');
        var imgEl = document.createElement('img');
        var icon = day.weather[0].icon;
        imgEl.alt = icon;
        imgEl.width = 90;
        imgEl.height = 90;
        imgEl.src = "http://openweathermap.org/img/wn/" + icon + "@2x.png"; //fetches icon from open weather api
        dateEl.textContent = date;
        tempEl.textContent = temp;
        fiveDayEl.append(colEl);
        colEl.append(cardEl);
        cardEl.append(tempEl);
        cardEl.append(imgEl);
        cardEl.append(dateEl);
    }
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
    var citySet = Array.from(new Set(names));
    var data = JSON.stringify(citySet);
    localStorage.setItem('cities', data);
    displayButtons();
};

var getGeo = function (locations) { //gets and saves city info
    var city = locations[0];
    console.log('LAT', city.lat);
    console.log('LON', city.lon);
    saveToLocalStorage(city.name);
    getOneCall(city);
};

var displayButtons = function () { //displays previously stored cities
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

var handleCityClick = function (event) { //selects locally stored city
    event.preventDefault();
    if (event.target.matches('button')) {
        var q = event.target.textContent;
        var geoURL = `http://api.openweathermap.org/geo/1.0/direct?q=${q}&appid=${appid}`;
        fetch(geoURL)
            .then(toJSON)
            .then(getGeo);
    }
};

var runSearch = function (event) { //search for new city
    event.preventDefault();
    var q = document.querySelector('#q');
    var geoURL = `http://api.openweathermap.org/geo/1.0/direct?q=${q.value}&appid=${appid}`;
    fetch(geoURL)
        .then(toJSON)
        .then(getGeo);
};

searchEl.addEventListener('click', runSearch);
searchedCities.addEventListener('click', handleCityClick);
displayButtons(); //displays previous searches on page refresh
