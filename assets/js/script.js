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
    var iconDescription = storedCityData.current.weather[0].description
    currentConditionEl.innerHTML = 
    `<figure>
        <img src="https://openweathermap.org/img/wn/${icon}@4x.png">
        <figcaption id="current-condition-description">${iconDescription}</figcaption>
    </figure>`
    currentHumidityEl.textContent = `Humidity: ${storedCityData.current.humidity}`
    currentWindspeedEl.textContent = `Wind Speed: ${storedCityData.current.wind_speed}`
    currentUVIndexEl.textContent = `UV index:${storedCityData.current.uvi}`
}        

function loadFiveDayForcast(){
    var storedCityData = JSON.parse(localStorage.getItem(cityName))
    $('#five-day-forcast').text('')
    for(var i = 0; i < 5; i++){
        var iconSmall = `${storedCityData.daily[`${i}`].weather[0].icon}`
        var date = dayjs().add(`${i}`,'day').format('dddd')
        var dayContainerEl = $("<div>")
        var dateDiv =      $("<div>");
        var conditionDiv = $("<div>");
        var conditionImg = $("<img>")
        var tempDiv =      $("<div>");
        var windDiv =      $("<div>");
        var humidityDiv =  $("<div>");

        dayContainerEl.addClass(`day`)
        dayContainerEl.attr('id', `day-${i}`)
        
        dateDiv.attr('id',`date-${i}`)
        conditionDiv.attr('id',`condition-${i}`)
        tempDiv.attr('id',`temp-${i}`)
        windDiv.attr('id',`wind-${i}`)
        humidityDiv.attr('id',`humidity-${i}`)
        dateDiv.text(date)
        conditionImg.attr('src', `https://openweathermap.org/img/wn/${iconSmall}@2x.png`)
        tempDiv.text(`${Math.floor(storedCityData.daily[`${i}`].temp.day) - 273}C` )
        windDiv.text(`${storedCityData.daily[`${i}`].wind_speed}m/s`)
        humidityDiv.text(`${storedCityData.daily[`${i}`].humidity}%`)
        $('#five-day-forcast').append(dayContainerEl)
        dayContainerEl.append(dateDiv, conditionDiv, tempDiv, windDiv, humidityDiv)
        conditionDiv.append(conditionImg)
        console.log(date);

    }

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
                loadFiveDayForcast()
                
            })
    }
    )}

searchFieldEl.addEventListener('keypress', function(e){
    if(e.key === 'Enter'){
        searchText = searchFieldEl.value
        fetchWeatherData();
    }
})
searchSubmitEl.addEventListener('click', function(){
    searchText = searchFieldEl.value
    fetchWeatherData();
})

