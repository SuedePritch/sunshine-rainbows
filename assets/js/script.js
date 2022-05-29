var now = dayjs().format('dddd MMM D YYYY')
var apiKey = "0e55a5a5786ba0f434d9a700c4847843"
var cityLongitude;
var cityLatitude;
// http://api.openweathermap.org/geo/1.0/direct?q=Toronto&appid=0e55a5a5786ba0f434d9a700c4847843
var searchFieldEl = document.getElementById('search')
var searchSubmitEl = document.getElementById('searchSubmit')
var searchHistoryEl = $('#save-search')
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

    currentCityNameEl.textContent = `${cityName} `
    currentDateEl.textContent = now
    currentTempEl.textContent = `Temp: ${Math.floor(storedCityData.current.temp - 273)} C`
    var icon = storedCityData.current.weather[0].icon
    var iconDescription = storedCityData.current.weather[0].description
    currentConditionEl.innerHTML = 
    `<figure>
        <img src="https://openweathermap.org/img/wn/${icon}@4x.png">
        <figcaption id="current-condition-description">${iconDescription}</figcaption>
    </figure>`
    currentHumidityEl.textContent = `Humidity: ${storedCityData.current.humidity} %`
    currentWindspeedEl.textContent = `Wind Speed: ${storedCityData.current.wind_speed} m/s`
    currentUVIndexEl.textContent = `UV index:${storedCityData.current.uvi}`
    
    if(storedCityData.current.uvi >= 11){
        currentUVIndexEl.setAttribute('class', 'extreme-uv')
    }else if(storedCityData.current.uvi < 11 && storedCityData.current.uvi >= 8){
        currentUVIndexEl.setAttribute('class', 'very-high-uv')
    }else if(storedCityData.current.uvi < 8 && storedCityData.current.uvi >= 6){
        currentUVIndexEl.setAttribute('class', 'high-uv')
    }else if(storedCityData.current.uvi < 6 && storedCityData.current.uvi >=3){
        currentUVIndexEl.setAttribute('class', 'medium-uv')
    }else if(storedCityData.current.uvi < 3){
        currentUVIndexEl.setAttribute('class', 'low-uv')
    }else{
        return
    }
}        

function loadFiveDayForcast(){
    var storedCityData = JSON.parse(localStorage.getItem(cityName))
    //this makes the 5day empty, as content is not updated just added
    $('#five-day-forcast').text('')

    for(var i = 0; i < 5; i++){
        var iconSmall = `${storedCityData.daily[`${i}`].weather[0].icon}`
        var date = dayjs().add(`${i}`,'day').format('MMM DD')
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
        tempDiv.text(`Temp: ${Math.floor(storedCityData.daily[`${i}`].temp.day) - 273}C` )
        windDiv.text(`Wind: ${storedCityData.daily[`${i}`].wind_speed}m/s`)
        humidityDiv.text(`Humidity ${storedCityData.daily[`${i}`].humidity}%`)
        $('#five-day-forcast').append(dayContainerEl)
        dayContainerEl.append(dateDiv, conditionDiv, tempDiv, windDiv, humidityDiv)
        conditionDiv.append(conditionImg)

    }

    }






function fetchWeatherData(){
    //find lat and long from city name
    //https://openweathermap.org/api/geocoding-api
    fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${searchText}&appid=${apiKey}`)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        cityName = searchText
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
        saveSearchHistory()
        fetchWeatherData();
    }
})
searchSubmitEl.addEventListener('click', function(){
    searchText = searchFieldEl.value
    saveSearchHistory()
    fetchWeatherData();
})
function saveSearchHistory(){
    var singleSavedSearch = $("<button>");
    singleSavedSearch.addClass('search-history-button')
    singleSavedSearch.attr('id', `${searchFieldEl.value}`)
    singleSavedSearch.text(searchFieldEl.value);
    $('#save-search').append(singleSavedSearch)
}

searchHistoryEl.on('click', '.search-history-button' , function(event){
    var chosenSavedSearch = event.target.id
    cityName = chosenSavedSearch
    JSON.parse(localStorage.getItem(cityName))
    loadCurrentWeather();
    loadFiveDayForcast();
})

