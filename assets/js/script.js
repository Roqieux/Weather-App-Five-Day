//document listeners 

var searchFormEl = document.querySelector('#search-form');
var btn = document.querySelector('.btn');
var cityInputEl = document.querySelector('#cityname');
var cityContainerEl = document.querySelector('#search-output-divs');
//var 

var APIkey = "84d432449debd5602d5b6391507b4419"
var lat = ""
var lon = ""



//functions

var formInputHandler = function (event) {
    event.preventDefault();

    var cityname = cityInputEl.value.trim();

    if (cityname) {
        getCityLatLon(cityname);
        getCityForecast(lat,lon)

        cityContainerEl.textContent = '';
        cityInputEl.value = '';
    } else {
        alert('Please enter a city');
    }
};

var historicCityClickHandler = function (event) {
    var historicCity = event.target.getAttribute('city-name');

    if (historicCity) {
        getCityLatLon(historicCity);

        cityContainerEl.textContent = '';
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
        console.log(data);
        lat = data[0].lat.toFixed(2);
        console.log(lat);
        lon = data[0].lon.toFixed(2);
        console.log(lon);
    });

};

var getCityForecast = function (lat,lon) {
    var baseCityForecastUrl = new URL("https://api.openweathermap.org/data/3.0/onecall");
    baseCityForecastUrl.searchParams.append("lat", lat)
    baseCityForecastUrl.searchParams.append("lon", lon)
    baseCityForecastUrl.searchParams.append("exclude", "current,minutely,hourly,alerts")
    baseCityForecastUrl.searchParams.append("appid", APIkey)

    console.log(baseCityForecastUrl);
    fetch(baseCityForecastUrl)
    .then(function (response){
        return response.json();
    })
    .then(function (data) {
        console.log(data);

    });
    

};

searchFormEl.addEventListener('submit', formInputHandler);
