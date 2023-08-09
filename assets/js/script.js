$(function () {
    var apiKey = "f0a9ced23d9ee94731355fb7fd77e338";
    var cityInput = "";
    var lat = "";
    var lon = "";
    var searchHistory = [];

    // 1. Use daysjs to display dates
    // display today
    var today = dayjs().format("(M/D/YYYY)");
    $(".current-date").text(today);

    // display future dates
    var dayone = dayjs().add(1, "d").format("M/D/YYYY");
    $(".title-1").text(dayone);
    var daytwo = dayjs().add(2, "d").format("M/D/YYYY");
    $(".title-2").text(daytwo);
    var daythree = dayjs().add(3, "d").format("M/D/YYYY");
    $(".title-3").text(daythree);
    var dayfour = dayjs().add(4, "d").format("M/D/YYYY");
    $(".title-4").text(dayfour);
    var dayfive = dayjs().add(5, "d").format("M/D/YYYY");
    $(".title-5").text(dayfive);

    // TODO: separate current city and current date Els

    // 2. Grab user input and append it to the page
    var cityFormEl = $(".city");
    var currentCity = $(".current-city");
    var submitButton = $(".btn");

    function handleFormSubmit(event) {
        event.preventDefault();
        currentCity.empty();

        //select form element by its name attribute and get its value
        cityInput = $('input[name="city-input"]').val();

        if (!cityInput) {
            console.log("No city entered");
            return;
        }

        //append city input to the page
        currentCity.prepend(cityInput);

        saveToLclStrg();
        getLatLon();

        renderSearchHistory();
    }

    //Create a submit event listener on the form element
    submitButton.on("click", handleFormSubmit);

    // 3. Use geocoding API
    function getLatLon() {
        var geocodeUrl =
            "http://api.openweathermap.org/geo/1.0/direct?q=" +
            cityInput +
            "&limit=5&appid=" +
            apiKey;
        fetch(geocodeUrl)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                // grab lat and lon data
                console.log(data);
                lat = data[0].lat;
                lon = data[0].lon;
                console.log(lat);
                console.log(lon);
                getCurrentWeather();
                getForecast();
            });
    }

    // 4. Link current weather API and pull data
    function getCurrentWeather() {
        console.log(lat);
        var weatherUrl =
            "https://api.openweathermap.org/data/2.5/weather?lat=" +
            lat +
            "&lon=" +
            lon +
            "&appid=" +
            apiKey +
            "&units=imperial";
        fetch(weatherUrl)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                console.log(data);
                var temp = data.main.temp;
                var wind = data.wind.speed;
                var humidity = data.main.humidity;
                $(".temp").text(temp);
                $(".wind").text(wind);
                $(".humidity").text(humidity);
            });
    }

    // 5. Link 5 day weather API
    function getForecast() {
        var fiveDayWeatherUrl =
            "https://api.openweathermap.org/data/2.5/forecast?lat=" +
            lat +
            "&lon=" +
            lon +
            "&appid=" +
            apiKey +
            "&units=imperial";
        fetch(fiveDayWeatherUrl)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                // for loop to display weather for 24 hrs from now (objects 7, 15, 23, 31, 39)
                console.log(data);
                for (i = 7; i < 40; i += 8) {
                    var tempForecast = data.list[i].main.temp;
                    var windForecast = data.list[i].wind.speed;
                    var humidityForecast = data.list[i].main.humidity;
                    $(".temp-" + i).text(tempForecast);
                    $(".wind-" + i).text(windForecast);
                    $(".humidity-" + i).text(humidityForecast);
                }
            });
    }

    // 6. Use local storage to display previous searches
    // Save each search to local storage
    function saveToLclStrg() {
        searchHistory.push(cityInput);
        localStorage.setItem("search-history", JSON.stringify(searchHistory));
    }

    // 7. Display on UI upon page loading
    function renderSearchHistory() {
        var cityButton = $("<button></button>");

        for (i = 0; i < searchHistory.length; i++) {
            localStorage.getItem(searchHistory[i]);
            $(".city-buttons").append(cityButton.addClass(i));
            cityButton.text(searchHistory[i]);
            cityButton.addClass("btn btn-secondary btn-lg btn-block");
            cityButton.on("click", getButtonLatLon(searchHistory[i]));
        }
    }

    function getButtonLatLon(cityInput) {
        console.log(cityInput);
        var geocodeUrl =
            "http://api.openweathermap.org/geo/1.0/direct?q=" +
            cityInput +
            "&limit=5&appid=" +
            apiKey
        fetch(geocodeUrl)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                // grab lat and lon data
                console.log(data);
                lat = data[0].lat;
                lon = data[0].lon;
                console.log(lat);
                console.log(lon);
                getCurrentWeather();
                getForecast();
            });
    }

    renderSearchHistory();
});
