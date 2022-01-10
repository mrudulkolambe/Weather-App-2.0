let home = document.getElementById('home');
let weeklyWeather = document.getElementById('weeklyWeather');
let searchLoaction = document.getElementById('searchLoaction');
let currentTemp = document.getElementById('currentTemp');
let condition = document.getElementById('condition');
let windSpeed = document.getElementById('windSpeed');
let humidity = document.getElementById('humidity');
let pressure = document.getElementById('pressure');
let feelsLike = document.getElementById('feelsLike');
let queryLocation = document.getElementById('queryLocation');
let homeWeather = document.getElementById('homeWeather');
let minTemp = document.getElementById('minTemp');
let maxTemp = document.getElementById('maxTemp');
let weekDays = document.getElementById('weekDays');
let apiKey = '04e93bd1bc303e7cb5e90180c801c9d3';
let recent = document.getElementById('recent');
let url = `https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&exclude=minutely&appid=${apiKey}`;
var searchArray = [];
let searchArrayIterator = 0;
home.style.display = 'block';
function menuToggle(params) {
    switch (params) {
        case 'home':
            home.style.display = 'block';
            weeklyWeather.style.display = 'none';
            searchLoaction.style.display = 'none';
            break;
        case 'week':
            home.style.display = 'none';
            weeklyWeather.style.display = 'block';
            searchLoaction.style.display = 'none';
            break;
        case 'search':
            home.style.display = 'none';
            weeklyWeather.style.display = 'none';
            searchLoaction.style.display = 'block';
            query.focus();
            break;
        case 'search':
            home.style.display = 'none';
            weeklyWeather.style.display = 'none';
            searchLoaction.style.display = 'block';
            break;
    }
}
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        console.log("Geolocation is not supported by this browser.");
    }
}

async function showPosition(data) {
    let weatherObj = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${data.coords.latitude}&lon=${data.coords.longitude}&units=metric&appid=${apiKey}`);
    let weatherJson = await weatherObj.json();
    getWeather(weatherJson);
}

async function getWeather(json) {
    queryLocation.innerHTML = json.name + " " + json.sys.country;
    currentTemp.innerHTML = json.main.temp + '&#186;C';
    condition.innerHTML = json.weather[0].description;
    windSpeed.innerHTML = json.wind.speed + 'm/s';
    humidity.innerHTML = json.main.humidity + '%';
    pressure.innerHTML = json.main.pressure + 'mBar';
    feelsLike.innerHTML = json.main.feels_like + '&#186;C';
    minTemp.innerHTML = json.main.temp_min + '&#186;C';
    maxTemp.innerHTML = json.main.temp_max + '&#186;C';
    chooseIcon(`${json.weather[0].icon}`, 'home');
    let weekWeatherObj = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${json.coord.lat}&lon=${json.coord.lon}&units=metric&appid=${apiKey}`);
    let weekJson = await weekWeatherObj.json();
    getWeekWeather(weekJson);
}
function getWeekWeather(json) {
    weekDays.innerHTML = '';
    for (let i = 1; i < json.daily.length; i++) {
        weekDaysDisplay(json.daily[i])
    }
}

function weekDaysDisplay(json) {
    let html = `
    <div class="days">
            <div class="tempIcon">
            <div class="weekDay">${window.moment(json.dt * 1000).format('dddd')}</div>
            <div class="weekIcon">
                <div>${chooseIcon(`${json.weather[0].icon}`, 'week')}</div>
            </div>
            <div class="weekTemp">
                <div class="weekAvgTemp">
                    ${json.temp.day.toFixed(1)}&#186;C
                </div>
                <div class="weekFeelsLikeTemp">
                    ${json.feels_like.day.toFixed(1)}&#186;C
                </div>
            </div>  
        </div>
    </div>
    `
    weekDays.innerHTML += html;
}

async function searchQuery() {
    let query = document.getElementById('query');
    let queryObj = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${query.value}&limit=5&appid=${apiKey}`);
    let queryJson = await queryObj.json();
    menuToggle('home');
    let data = {
        coords: {
            latitude: queryJson[0].lat,
            longitude: queryJson[0].lon
        }
    }
    addToList();
    showPosition(data);
    query.value = "";
    getList();
}

function chooseIcon(condition, page) {
    let icon = '';
    condition = Number(condition.slice(0, 2));
    switch (condition) {
        case 01:
            icon = '<i class="bi bi-cloud-sun"></i>'
            break;
        case 02:
            icon = '<i class="bi bi-cloud"></i>'
            break;
        case 03:
            icon = '<i class="bi bi-clouds"></i>'
            break;
        case 04:
            icon = '<i class="bi bi-clouds"></i>'
            break;
        case 09:
            icon = '<i class="bi bi-cloud-rain"></i>'
            break;
        case 10:
            icon = '<i class="bi bi-cloud-rain"></i>'
            break;
        case 11:
            icon = '<i class="bi bi-cloud-lightning"></i>'
            break;
        case 13:
            icon = '<i class="bi bi-snow3"></i>'
            break;
        case 50:
            icon = '<i class="bi bi-cloud-haze"></i>'
            break;
    }
    if (page == 'home') {
        homeWeather.innerHTML = icon;
    }
    else if (page == 'week') {
        return icon;
    }

}
searchLoaction.addEventListener('keydown', (e) => {
    if (e.key == 'Enter') {
        searchQuery()
    }
})


const addToList = () => {
    if (searchArrayIterator >= 4) {
        searchArrayIterator = 0;
        searchArray[searchArrayIterator] = query.value;
        searchArrayIterator++;
    }
    else {
        searchArray[searchArrayIterator] = query.value;
        searchArrayIterator++;
    }
    localStorage.setItem('recent-searches', JSON.stringify(searchArray));
}

const getList = () => {
    recent.innerHTML = '';
    let recentSearch = JSON.parse(localStorage.getItem('recent-searches'));
    console.log(recentSearch)
    if (recentSearch == null) {
        recent.innerHTML = 'No Recent Searches Found'
    }
    else {
        recentSearch.map(search => {
            recent.innerHTML += `
            <div onclick="loadCity('${search}')" class="search-item">
                <h4>${search}</h4>
            </div>
            `
        })
    }

}
const loadCity = (item) => {
    query.value = item;
    searchQuery();
}
getList()