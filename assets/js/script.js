var now = dayjs().format('dddd MMM D YYYY')
var apiKey = "0e55a5a5786ba0f434d9a700c4847843"
var cityLongitude;
var cityLatitude;
// http://api.openweathermap.org/geo/1.0/direct?q=Toronto&appid=0e55a5a5786ba0f434d9a700c4847843
var searchFieldEl = document.getElementById('search')
var searchSubmitEl = document.getElementById('searchSubmit')
var searchText;
var cityName;

var currentCityNameEl = document.getElementById('current-cityname')
var currentDateEl = document.getElementById('current-date')
var currentTempEl = document.getElementById('current-temp')
var currentConditionEl = document.getElementById('current-conditions')
var currentHumidityEl = document.getElementById('current-humidity')
var currentWindspeedEl = document.getElementById('current-windspeed')
var currentUVIndexEl = document.getElementById('current-uvindex')

function loadCurrentWeather(){
    var storedCityData = JSON.parse(localStorage.getItem(cityName))
    currentCityNameEl.textContent = `${cityName.name}, ${cityName.state}, ${cityName.country} `
    currentDateEl.textContent = now
    currentTempEl.textContent = `Temp: ${Math.floor(storedCityData.current.temp - 273)} C`
    var icon = storedCityData.current.weather[0].icon
    currentConditionEl.innerHTML = `<img src=https://openweathermap.org/img/wn/${icon}@4x.png>`
    
    currentHumidityEl.textContent = `Humidity: ${storedCityData.current.humidity}`
    currentWindspeedEl.textContent = `Wind Speed: ${storedCityData.current.wind_speed}`
    currentUVIndexEl.textContent = `UV index:${storedCityData.current.uvi}`
}        

function fetchWeatherData(){
    //find lat and long from city name
    //https://openweathermap.org/api/geocoding-api
    fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${searchText}&appid=${apiKey}`)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        cityName = {
            name:data[0].name,
            state:data[0].state,
            country:data[0].country
        }
        console.log(cityName);
        cityLatitude = data[0].lat
        cityLongitude = data[0].lon
    }).then(function (){
        //generic api call for weather
        //https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&exclude={part}&appid={API key}
        //testing with toronto
        //https://api.openweathermap.org/data/2.5/onecall?lat=43.6534817&lon=-79.3839347&appid=0e55a5a5786ba0f434d9a700c4847843
        fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${cityLatitude}&lon=${cityLongitude}&appid=${apiKey}`)
        .then(function (response) {
            return response.json();
            })
            .then(function (data) {
                localStorage.setItem(cityName, JSON.stringify(data))
                loadCurrentWeather()
                
            })
        })

    }
searchSubmitEl.addEventListener('click', function(){
    searchText = searchFieldEl.value
    
    fetchWeatherData();
})
