//document listeners 

var searchFormEl = document.querySelector('#search-form');
var btn = document.querySelector('.btn');
var cityInputEl = document.querySelector('#cityname')
var cityTitleEl = document.querySelector('#current-search-term');
var fiveDayTitleEl = document.querySelector('#five-day-search-term');
var fiveDayContainerEl = document.querySelector('#search-output-divs');
var currentDayContainerEl = document.querySelector('#current-day-weather-div');
//var 

var APIkey = "84d432449debd5602d5b6391507b4419"


//functions

var formInputHandler = function (event) {
    event.preventDefault();

    var cityname = cityInputEl.value.trim();
    console.log(cityname)

    if (cityname) {
        getCityLatLon(cityname);
        
        cityTitleEl.textContent = cityname;
        fiveDayTitleEl.textContent = cityname;
        
    } else {
        alert('Please enter a city');
        return;
    }
};

var historicCityClickHandler = function (event) {
    var historicCity = event.target.getAttribute('city-button');

    if (historicCity) {
        getCityLatLon(historicCity);

        cityTitleEl.textContent = '';
    }
};

var getCityLatLon = function (location) {
    var baseGeoUrl = new URL("http://api.openweathermap.org/geo/1.0/direct");
    baseGeoUrl.searchParams.append("q", location)
    baseGeoUrl.searchParams.append("limit", "1")
    baseGeoUrl.searchParams.append("appid", APIkey)

    console.log(baseGeoUrl);
    fetch(baseGeoUrl)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        
        lat = data[0].lat;
        lon = data[0].lon;

        retreiveForecast(lat,lon);
    })
    
};

var retreiveForecast = function (lat,lon) {
    var baseCityForecastUrl = new URL("https://api.openweathermap.org/data/3.0/onecall");
    baseCityForecastUrl.searchParams.append("lat", lat)
    baseCityForecastUrl.searchParams.append("lon", lon)
    baseCityForecastUrl.searchParams.append("exclude", "minutely,hourly,alerts")
    baseCityForecastUrl.searchParams.append("appid", APIkey)
    baseCityForecastUrl.searchParams.append("units", "imperial")

    console.log(baseCityForecastUrl);
    fetch(baseCityForecastUrl)
    .then(function (response) {
        if(response.ok) {
            response.json()
        .then(function (wData) {
            displayWeather(wData);
        });

        } else {
            alert('Error: ' + response.statusText);
        }
    });
};

var displayWeather = function (forecast, cityName) {
    if(forecast.length === 0) {
        currentDayContainerEl.textContent = 'No forecast found.';
        return;
    }

    //Current forecast element creations
        var array = forecast.current
    
        var day = dayjs.unix(array.dt);
        var wind = array.wind_speed;
        var windDeg = array.wind_deg;
        var temp = array.temp;
        var general = array.weather[0].main;
        var icon = array.weather[0].icon;
        var summary = array.weather[0].description;

        console.log(day);
        console.log(wind);
        console.log(windDeg);
        console.log(temp);
        console.log(general);
        console.log(icon);
        console.log(summary);

        forecastContainerEl = document.createElement('div');
        forecastContainerEl.classList = 'flex-row align-center col-sm-12 col-lg-2';

        //Current container display 
        var titleEl = document.createElement('p');
        var display5Day = dayjs(day).format('ddd');
        
        titleEl.textcontent = display5Day;
        forecastContainerEl.appendChild(titleEl);

        //Current temp display
        var tempEl = document.createElement('p');

        tempEl.textContent = temp;
        forecastContainerEl.appendChild(tempEl);


        //Current icon display
        var iconEl = document.createElement('img');
        
        if (icon) {
            iconEl.src = "./assets/images/"+icon+".png";
        };

        iconEl.alt = "Weather icon";
        forecastContainerEl.appendChild(iconEl);


        iconEl.classList = '5day-icon'
        
        //Current general display
        var genEl = document.createElement('p');

        genEl.textContent = general;

        //Current wind speed display
        var windEl = document.createElement('p');
        
        if (wind > 50) {
            windEl.textContent = "Its heckin WIMDY" + wind;
        } else {
            windEl.textContent = wind;
        };

        forecastContainerEl.appendChild(windEl);

        //Current summary display 
        var summaryEl = document.createElement('p');

        summaryEl.textContent = summary;


        forecastContainerEl.appendChild(summaryEl);
        currentDayContainerEl.appendChild(forecastContainerEl);

    //Current forecast complete. 



    //5 day forecast element creation 
    for (var i=0; i < 5 ; i++) {
        array = forecast.daily[i];
        console.log(array);
        
        day = dayjs.unix(array.dt);
        wind = array.wind_speed;
        windDeg = array.wind_deg;
        temp = array.temp.day;
        general = array.weather[0].main;
        icon = array.weather[0].icon;
        summary = array.summary;

        console.log(day);
        console.log(wind);
        console.log(windDeg);
        console.log(temp);
        console.log(general);
        console.log(icon);
        console.log(summary);

        //5 day create element 
        forecastContainerEl = document.createElement('div');
        forecastContainerEl.classList = 'flex-row align-center col-sm-12 col-lg-2';

        //5 day container display 
        var titleEl = document.createElement('p');
        var display5Day = dayjs(day).format('ddd');
        
        titleEl.textcontent = display5Day;
        forecastContainerEl.appendChild(titleEl);

        //5 day temp display
        var tempEl = document.createElement('p');

        tempEl.textContent = temp;
        forecastContainerEl.appendChild(tempEl);


        //5 day icon display
        var iconEl = document.createElement('img');
        
        if (icon) {
            iconEl.src = "./assets/images/"+icon+".png";
        };

        iconEl.alt = "Weather icon";
        forecastContainerEl.appendChild(iconEl);


        iconEl.classList = '5day-icon'
        
        //5 day general display
        var genEl = document.createElement('p');

        genEl.textContent = general;

        //5 day wind speed display
        var windEl = document.createElement('p');
        
        if (wind > 50) {
            windEl.textContent = "Its heckin WIMDY" + wind;
        } else {
            windEl.textContent = wind;
        };

        forecastContainerEl.appendChild(windEl);

        //5 day summary display 
        var summaryEl = document.createElement('p');

        summaryEl.textContent = summary;
        forecastContainerEl.appendChild(summaryEl);
        fiveDayContainerEl.appendChild(forecastContainerEl);

    //5 day forecast complete. 
    }
};

searchFormEl.addEventListener('submit', formInputHandler);
