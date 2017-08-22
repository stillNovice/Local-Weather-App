var tempC, tempF; // Celcius and Farenheit temperatures.

$(document).ready(function() {
  let tempUnit = 'C';
  let api = "https://fcc-weather-api.glitch.me/api/current?";

  // checking if we have the Geolocation Object. i.e; whether geolocation api is enabled or not.
  if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      let longitude = position.coords.longitude;
      let latitude = position.coords.latitude;

      runWeatherApi(api, longitude, latitude);
      //console.log('data', data);
    })
  } else {
    console.error("sorry, Geolocation Api disabled");
  }

  $('.tempUnit').click(function() {
    tempUnit = (tempUnit == 'C' ? 'F' : 'C');
    $(this).html('<sup>o</sup><a href="#">' + tempUnit + '</a>');

    let tempVal;
    if(tempUnit == 'C') {
      tempVal = tempC;
    } else {
      tempVal = tempF;
    }

    tempVal = tempVal.toFixed(1);
    $('.temp').text(tempVal);
  });

});

function runWeatherApi(api, lon, lat) {
  $.ajax({
    url: api + 'lat=' + lat + '&lon=' + lon,
    dataType: 'json',
    crossDomain: true,
    success: function(data) {
      console.log('data', data);
      document.documentElement.style.setProperty('--img_url', 'url(../images/' + (data.weather[0].main).toLowerCase() + '.jpg)');

      tempC = data.main.temp;
      tempF = ((tempC * 9) / 5) + 32;

      getFlag(data.name, data.sys.country, data.main.temp, data.weather[0]);
    },
    failure: function(err) {
      console.error(err);
    }
  });
}

function getFlag(city, country, temp, weatherObj) {
  $.ajax({
    url: "https://restcountries.eu/rest/v2/alpha/" + country,
    dataType: 'json',
    crossDomain: true,
    success: function(data){
      console.log('country data', data);

      $('#location').html(city + ', <img src="' + data.flag + '" height=40px; width=40px;/>' + country);
      $('.temp').text(temp.toFixed(1));
      $('.tempUnit').html('<sup>o</sup><a href="#">C</a>');
      $('.weather').html(', <img src="' + weatherObj.icon + '" /> ' + weatherObj.main);
    },
    failure: function(err) {
      console.log(err);
    }
  });
}