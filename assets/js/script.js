//document listeners 

var searchFormEl = document.querySelector('#search-form');
var btn = document.querySelector('.btn');
var cityInputEl = document.querySelector('#cityname')
var cityTitleEl = document.querySelector('#current-search-term');
var fiveDayTitleEl = document.querySelector('#five-day-search-term');
var fiveDayContainerEl = document.querySelector('#search-output-divs');
var currentDayContainerEl = document.querySelector('#current-day-weather-div');
var buttonContainerEl = document.getElementById('historic-button-container')
//var 

var APIkey = "84d432449debd5602d5b6391507b4419"


//functions

var formInputHandler = function (event) {
    event.preventDefault();

    removeDisplays();

    var cityname = cityInputEl.value.trim();
    

    if (cityname) {
        getCityLatLon(cityname);
        generateHistoryButtons(cityname);
        
        cityTitleEl.textContent = cityname;
        fiveDayTitleEl.textContent = cityname;
        
    } else {
        alert('Please enter a city');
        return;
    }
};

var historicCityClickHandler = function (event) {
    
    var historicCity = event.target.getAttribute('id');

    removeDisplays();

    if (historicCity) {
        getCityLatLon(historicCity);
        generateHistoryButtons(historicCity);


        cityTitleEl.textContent = historicCity;
        fiveDayTitleEl.textContent = historicCity;
    }
};

//API retrieval with city name paramater

var getCityLatLon = function (location) {
    var baseGeoUrl = new URL("http://api.openweathermap.org/geo/1.0/direct");
    baseGeoUrl.searchParams.append("q", location)
    baseGeoUrl.searchParams.append("limit", "1")
    baseGeoUrl.searchParams.append("appid", APIkey)

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

//API retrieval with latitude and longitude params

var retreiveForecast = function (lat,lon) {
    var baseCityForecastUrl = new URL("https://api.openweathermap.org/data/3.0/onecall");
    baseCityForecastUrl.searchParams.append("lat", lat)
    baseCityForecastUrl.searchParams.append("lon", lon)
    baseCityForecastUrl.searchParams.append("exclude", "minutely,hourly,alerts")
    baseCityForecastUrl.searchParams.append("appid", APIkey)
    baseCityForecastUrl.searchParams.append("units", "imperial")

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

var displayWeather = function (forecast) {
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

        forecastContainerEl = document.createElement('div');
        forecastContainerEl.classList = 'flex-row text-align-center col-sm-12 col-lg-2';

        //Current container display 
        var titleEl = document.createElement('p');
        var display5Day = dayjs(day).format('ddd');
        
        titleEl.textcontent = display5Day;
        forecastContainerEl.appendChild(titleEl);

        //Current temp display
        var tempEl = document.createElement('p');

        tempEl.textContent = temp + " degrees";
        tempEl.classList=""
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
            windEl.textContent = wind + " mph";
        };

        forecastContainerEl.appendChild(windEl);

        //Current summary display 
        var summaryEl = document.createElement('p');

        summaryEl.textContent = summary;


        forecastContainerEl.appendChild(summaryEl);
        forecastContainerEl.classList="bg-light border-primary-subtle shadow rounded col-6"
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

        tempEl.textContent = temp + " degrees";
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
            windEl.textContent = "Its heckin WIMDY" + wind + " mph";
        } else {
            windEl.textContent = wind + " mph";
        };

        forecastContainerEl.appendChild(windEl);

        //5 day summary display 
        var summaryEl = document.createElement('p');

        summaryEl.textContent = summary;
        forecastContainerEl.appendChild(summaryEl);
        forecastContainerEl.classList="bg-light border-primary-subtle shadow rounded col-sm-12 col-lg-2 min-vw-15"

        fiveDayContainerEl.appendChild(forecastContainerEl);

    //5 day forecast complete. 
    }
};

var removeDisplays = function () {
    //removes current weather div
    if (currentDayContainerEl.hasChildNodes()) {
        currentDayContainerEl.removeChild(currentDayContainerEl.firstChild);
    } else {
        return;
    } 
    //removes 5 day divs 
    if (fiveDayContainerEl.hasChildNodes()) {
        while (fiveDayContainerEl.hasChildNodes())
        fiveDayContainerEl.firstChild.remove()
    } else {
        return;
    }
};

//display the previous searches

var generateHistoryButtons = function (buttonName) {

    var storedSearches = [];
    var buttonEl = document.createElement('button');
    
    storedSearches = JSON.parse(localStorage.getItem("Previous Searches"));
    
    //check for existing local array and therefore buttons

    if (storedSearches == null) {  

        storedSearches = [];
        buttonEl.textContent = buttonName;
        buttonEl.classList = "m-2 btn btn-light btn-outline-secondary shadow";
        buttonEl.id = buttonName;
        buttonContainerEl.appendChild(buttonEl);

        storedSearches.unshift(buttonName);
        localStorage.setItem("Previous Searches", JSON.stringify(storedSearches));

        } else {
        
        //removes previous buttons to make room for re-insertion

        while (buttonContainerEl.hasChildNodes()){
        buttonContainerEl.firstChild.remove();
        };            

        //check if search item already exists in array

        if(storedSearches.includes(buttonName)) {

            storedSearches = storedSearches;

        } else {

        storedSearches.unshift(buttonName);

        };

        //keeps array at no more than 5 previous searches

        if(storedSearches.length > 5) {

            storedSearches.pop();

        } else {

            storedSearches = storedSearches;

        };

        //loop to create buttons within the historic button container

        for ( var i = 0; i < storedSearches.length ; i++) {

            var hisButtonEl = document.createElement('button')

            hisButtonEl.textContent = storedSearches[i];
            hisButtonEl.classList = "m-2 btn btn-light btn-outline-secondary shadow";
            hisButtonEl.id = storedSearches[i];
        
            buttonContainerEl.append(hisButtonEl);
            };

            localStorage.setItem("Previous Searches", JSON.stringify(storedSearches));
        
    };

};

//search bar submit button function

var searchGenerateButton = function (buttonName) {

    buttonEl.textContent = buttonName;
    buttonEl.classList = "m-2 btn btn-light btn-outline-secondary shadow";
    buttonEl.id = buttonName;
    buttonContainerEl.appendChild(buttonEl);
    storedSearches.unshift(buttonName);
    localStorage.setItem("Previous Searches", storedSearches);
};

var pageLoadGenerateButtons = function () {

    var storedSearches = [];
    var buttonEl = document.createElement('button');
    
    storedSearches = JSON.parse(localStorage.getItem("Previous Searches"));

    for (var i=0; i < storedSearches.length; i++) {
        var hisButtonEl = document.createElement('button')

            hisButtonEl.textContent = storedSearches[i];
            hisButtonEl.classList = "m-2 btn btn-light btn-outline-secondary shadow";
            hisButtonEl.id = storedSearches[i];
        
            buttonContainerEl.append(hisButtonEl);
            };

    };


//event listeners

searchFormEl.addEventListener('submit', formInputHandler);
buttonContainerEl.addEventListener('click',historicCityClickHandler);

//historic button generate on page load
pageLoadGenerateButtons();
