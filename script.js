    var appid = '485bbc753e29e9770f09ca55c32c6d79'; //had to use Anthony's API key
    var q = 'Chicago'; //currently loggin Chicago for testing
    var geoURL = `http://api.openweathermap.org/geo/1.0/direct?q=${q}&appid=${appid}`;

    fetch(geoURL)
      .then(function (response) {
        return response.json();
      })
      .then(function (locations) {
        var city = locations[0];
        console.log('LAT', city.lat);
        console.log('LON', city.lon);
        var oneCall = `https://api.openweathermap.org/data/2.5/onecall?lat=${city.lat}&lon=${city.lon}&appid=${appid}&units=imperial&exclude=hourly,minutely`;
        fetch(oneCall)
          .then(function (response) {
            return response.json();
          })
          .then(function (data) {
            console.log(data);
            var h2El = document.createElement('h2');
            var tempEl = document.createElement('p');
            h2El.textContent = city.name;
            tempEl.textContent = 'TEMP: ' + data.current.temp;
            document.body.appendChild(h2El);
            document.body.appendChild(tempEl);
          });
      });

      var saveToLocalStorage = function(city) { //saves entry to local storage
        var cities = JSON.parse(localStorage.getItem('cities')) || [];
        cities.push(city);
        var data = JSON.stringify(cities);
        localStorage.setItem('cities', data);
      };

