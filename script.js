// Id number needed to access the API
let appId = '4ec34d45c36f6fee7fb9427c490b032c';

// Get the searchbar and buttons
let searchTerm = document.getElementById("searchInput").value;
let button1 = document.getElementById("searchBtn");
let button2 = document.getElementById("locationBtn");

//Get Weather and Get Location buttons listeners
button1.addEventListener("click", searchFutureWeather.bind(null, searchTerm), false);
button2.addEventListener("click", geoFindMe);

// Get the modal
var modal1 = document.getElementById("myModal1");
var modal2 = document.getElementById("myModal2");
var modal3 = document.getElementById("myModal3");
var modal4 = document.getElementById("myModal4");
var modal5 = document.getElementById("myModal5");

// Get the button that opens the modal
var btn1 = document.getElementsByClassName("img")[0];
var btn2 = document.getElementsByClassName("img")[1];
var btn3 = document.getElementsByClassName("img")[2];
var btn4 = document.getElementsByClassName("img")[3];
var btn5 = document.getElementsByClassName("img")[4];

// Get the <span> element that closes the modal
var span1 = document.getElementsByClassName("close1")[0];
var span2 = document.getElementsByClassName("close2")[0];
var span3 = document.getElementsByClassName("close3")[0];
var span4 = document.getElementsByClassName("close4")[0];
var span5 = document.getElementsByClassName("close5")[0];

// When the user clicks on the button, open the modal
btn1.onclick = function() {modal1.style.display = "block";};
btn2.onclick = function() {modal2.style.display = "block";};
btn3.onclick = function() {modal3.style.display = "block";};
btn4.onclick = function() {modal4.style.display = "block";};
btn5.onclick = function() {modal5.style.display = "block";};

// When the user clicks on <span> (x), close the modal
span1.onclick = function() {modal1.style.display = "none";};
span2.onclick = function() {modal2.style.display = "none";};
span3.onclick = function() {modal3.style.display = "none";};
span4.onclick = function() {modal4.style.display = "none";};
span5.onclick = function() {modal5.style.display = "none";};


// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal1) {
      modal1.style.display = "none";
    }
    if (event.target == modal2) {
        modal2.style.display = "none";
    }
    if (event.target == modal3) {
        modal3.style.display = "none";
    }
    if (event.target == modal4) {
        modal4.style.display = "none";
    }
    if (event.target == modal5) {
        modal5.style.display = "none";
    }
};


// function gets data from the API based on the searchTerm and 
//calls drawWeatherPattern for (data, time, DOM element fraction of id or class)

function searchFutureWeather(searchTerm) {
	fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${searchTerm}&mode=json&appid=${appId}`)  
	.then(function(resp) { return resp.json() }) // Convert data to json
	.then(function(data) {
        //data in the API is devided in 3h periods, so time=0 stands for now, time=8 stands for 24h from now and so on...
        //third parameter is used to acces proper DOM elements e.g. <div id="forecast-tommorow"></div>

        drawWeatherPattern(data, 0, 'now');
        drawWeatherPattern(data, 8, 'tommorow');
        drawWeatherPattern(data, 16, '2nd');
        drawWeatherPattern(data, 24, '3rd');
        drawWeatherPattern(data, 32, '4th');
        drawWeatherPattern(data, 39, '5th');
	})
	.catch(function() {
		// catch any errors
	});
};


//function triggered when "Get Location" button is clicked, 
//gets coordinants and then calls getWeatherByLocation function

function geoFindMe() {

    const status = document.querySelector('#location');
    const mapLink = document.querySelector('#map-link');
  
    function success(position) {
      let latitude  =  position.coords.latitude;
      let longitude =  position.coords.longitude;
  
      let roundLatitude = latitude.toPrecision([5]);
      let roundLongitude = longitude.toPrecision([5]);

      //puts coordinants into the searchbar
      document.getElementById("searchInput").value = `Cords:${roundLatitude}°/${roundLongitude}°`;

      //calls getWeatherByLocation for recieved coords
      getWeatherByLocation(latitude, longitude);
    
      //render coords and link to Open Street Map with user's location
      status.textContent = '';
       mapLink.href = `https://www.openstreetmap.org/#map=18/${latitude}/${longitude}`;
       mapLink.innerHTML = `${roundLatitude} ° / ${roundLongitude} °`;
    }
  
    function error() {
        status.textContent = 'Unable to retrieve your location';
    }
  
    if (!navigator.geolocation) {
        status.textContent = 'Geolocation is not supported by your browser';
    } else {
      status.textContent = 'Locating…';
        navigator.geolocation.getCurrentPosition(success, error);
    }

}

//function gets data from the API based on the coordinants from geoFindMe function
//and calls drawWeatherPattern for (data, time, DOM element fraction of id or class)

function getWeatherByLocation(lat, lon) {
    fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&mode=json&appid=${appId}`)  
	.then(function(resp) { return resp.json() }) // Convert data to json
	.then(function(data) {

        //data in the API is devided in 3h periods, so time=0 stands for now, time=8 stands for 24h from now and so on...
        //third parameter is used to acces proper DOM elements e.g. <div id="forecast-tommorow"></div>

        drawWeatherPattern(data, 0, 'now');
        drawWeatherPattern(data, 8, 'tommorow');
        drawWeatherPattern(data, 16, '2nd');
        drawWeatherPattern(data, 24, '3rd');
        drawWeatherPattern(data, 32, '4th');
        drawWeatherPattern(data, 39, '5th');
	})
	.catch(function() {
		// catch any errors
	});
};


//function which actually renders data to the DOM
//parameters are (data, time, DOM element fraction of id or class)

function drawWeatherPattern (d, time, dom) {
    var celcius = Math.round(parseFloat(d.list[time].main.temp)-273.15);
    var description = d.list[time].weather[0].main;
    let picture;

    //find the weekday based on the date
    const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    let w = new Date(d.list[time].dt * 1000);
    let dayName = weekday[w.getDay()];

    //select the right picture to render
    if (description === 'Clear') {picture = 'img/clear_sky.png'};
    if (description === 'Few_clouds') {picture = 'img/few_clouds.png'};
    if (description === 'Scattered_clouds') {picture = 'img/scattered_clouds.png'};
    if (description === 'Clouds') {picture = 'img/broken_clouds.png'};
    if (description === 'Rain') {picture = 'img/shower_rain.png'};
    if (description === 'Drizzle') {picture = 'img/rain.png'};
    if (description === 'Thunderstorm') {picture = 'img/thunderstorm.png'};
    if (description === 'Snow') {picture = 'img/snow.png'};
    if (description === 'Mist') {picture = 'img/mist.png'};

    //change the DOM
    document.getElementById('location').innerHTML = d.city.name;
    document.getElementById(`${dom}-when`).textContent = `${dayName}`;
    document.getElementById(`${dom}-img`).innerHTML = `<img src=${picture}>`;
	document.getElementById(`${dom}-description`).innerHTML = d.list[time].weather[0].description;
	document.getElementById(`${dom}-temp`).innerHTML = celcius + '&deg;';
    document.getElementById(`${dom}-pressure`).innerHTML = '<span class="iconify" data-icon="wi:barometer" data-inline="false"></span>' + d.list[time].main.pressure + ' hPa';
    document.getElementById(`${dom}-humidity`).innerHTML = '<span class="iconify" data-icon="wi:humidity" data-inline="false"></span>' + d.list[time].main.humidity + ' %';
    document.getElementById(`${dom}-windspeed`).innerHTML = '<span class="iconify" data-icon="fa-solid:wind" data-inline="false"></span>' + d.list[time].wind.speed + ' m/s';
    document.getElementById(`${dom}-clouds`).innerHTML = '<span class="iconify" data-icon="uil:clouds" data-inline="false"></span>' + d.list[time].clouds.all + ' %';  
}

