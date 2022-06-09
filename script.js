const timeEl =document.getElementById("time");
const dateEl =document.getElementById("date");
const currentWeatherItemsEl = document.getElementById('current-weather-items');
const timezone = document.getElementById('time-zone');
const countryEl = document.getElementById('country');
const weatherforecastEl = document.getElementById('weather-forecast');
const currenttempEl = document.getElementById('current-info');

const days = ['Sunday' ,'Monday', 'Tuesday' , 'Wednesday','thursday','Friday','Saturday']
const months = ['Jan', 'Feb','Mar','April','May','June','July','Aug','Sep','Oct','Nov','Dec'];

const API_KEY = '1c8f40eb6b0dbb3a9e2c068800336ec6';

setInterval(() => {
    const time =new Date();
    const month = time.getMonth();
    const date = time.getDate();
    const year = time.getFullYear();
    const day = time.getDay();
    const hours = time.getHours();
    const hoursIn12hrsformat = hours >= 13 ? hours %12 : hours
    const minutes = time.getMinutes();
    const ampm = hours >=12 ? 'PM' : 'AM'

    timeEl.innerHTML = (hoursIn12hrsformat <10? '0'+hoursIn12hrsformat : hoursIn12hrsformat) + ":" + (minutes <10 ? '0'+ minutes: minutes)+ ' ' + `<span id="AM-PM">${ampm}</span>`
    dateEl.innerHTML = days[day] + ", " + date + ' '+months[month] + " " +year
}, 1000);

getWeatherData()
function getWeatherData(){
    navigator.geolocation.getCurrentPosition((success)=>{
        console.log(success);
        let{latitude , longitude} = success.coords;
        fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&units=metric&appid=${API_KEY}`).then(res => res.json()).then(data => {
            console.log(data);
            showWeatherData(data);
        })
    })
}
function showWeatherData(data){
    let{humidity , pressure, sunrise,sunset, wind_speed} = data.current;
      
    timezone.innerHTML = data.timezone;
    countryEl.innerHTML = data.lat + 'N ' + data.lon + 'E'

    currentWeatherItemsEl.innerHTML = 
    `<div class="weather-items">
    <div>Humidity</div>
    <div>${humidity} %</div>
     </div>
      <div class="weather-items">
   <div>Pressure</div>
   <div>${pressure}</div>
</div>
<div class="weather-items">
   <div>Wind Speed</div>
   <div>${wind_speed}</div>   
</div>
<div class="weather-items">
   <div>Sunrise</div>
   <div>${window.moment(sunrise * 1000).format('HH:mm a')}</div>   
</div>
<div class="weather-items">
   <div>Sunset</div>
   <div>${window.moment(sunset * 1000).format('HH:mm a')}</div>   
</div>`;

let otherDayForecast = ''
data.daily.forEach((day , idx) =>{
    if(idx == 0){
        currenttempEl.innerHTML = `
        <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="weather-icon" class="w-icon">
        <div class="other">
        <div class="day">${window.moment(day.dt * 1000).format('ddd')}</div>
        <div class="temp">Night: ${day.temp.night}&#176; C</div>
        <div class="temp">Day: ${day.temp.day}&#176; C</div>
        </div>`
    }
    else{
        otherDayForecast += `
        <div class="weather-forecast-item" id="weather-forecast-item">
               <div class="day">${window.moment(day.dt * 1000).format('ddd')}</div>
               <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="weather-icon" class="w-icon">
               <div class="temp">Night: ${day.temp.night}&#176; C</div>
               <div class="temp">Day:  ${day.temp.day}&#176; C</div>
            </div>`
    }
})
weatherforecastEl.innerHTML = otherDayForecast;
}

