var app = (function($) {
  'use strict';

  var TEMPERATURE_INTERVAL = 5000;
  var CLOCK_INTERVAL = 1000;
  var WEATHER_URL = 'https://api.openweathermap.org/data/2.5/weather';
  var WEATHER_API_KEY = (typeof CONFIG !== 'undefined' && CONFIG.OPENWEATHER_API_KEY) || '';

  var weatherFetchedAt = null;

  var toggles = [
    { id: 'kitchen-lights', on: 'fa-solid fa-lightbulb icon-light-on', off: 'fa-regular fa-lightbulb icon-light-off' },
    { id: 'living-ceiling-lights', on: 'fa-solid fa-lightbulb icon-light-on', off: 'fa-regular fa-lightbulb icon-light-off' },
    { id: 'living-ambient-lights', on: 'fa-solid fa-lightbulb icon-light-on', off: 'fa-regular fa-lightbulb icon-light-off' },
    { id: 'living-ambient-music', on: 'fa-solid fa-music icon-music', off: 'fa-solid fa-volume-xmark icon-music-off' }
  ];

  var thermometers = ['kitchen-temperature', 'living-temperature'];

  function pad(value) {
    return String(value).padStart(2, '0');
  }

  function updateToggleIcon(toggle) {
    var checked = $('#' + toggle.id).prop('checked');
    $('#' + toggle.id + '-icon').attr('class', checked ? toggle.on : toggle.off);
  }

  function initToggles() {
    $.each(toggles, function(index, toggle) {
      $('#' + toggle.id).on('change', function() {
        updateToggleIcon(toggle);
      });
      updateToggleIcon(toggle);
    });
  }

  function randomTemperature() {
    return 10 + Math.random() * 20;
  }

  function temperatureIcon(value) {
    if (value < 17) {
      return 'fa-solid fa-temperature-quarter icon-temp-cold';
    }
    if (value < 24) {
      return 'fa-solid fa-temperature-half icon-temp-mild';
    }
    return 'fa-solid fa-temperature-three-quarters icon-temp';
  }

  function updateTemperatures() {
    $.each(thermometers, function(index, id) {
      var value = randomTemperature();
      $('#' + id).text(value.toFixed(1) + ' °C');
      $('#' + id + '-icon').attr('class', temperatureIcon(value));
    });
  }

  function updateDate() {
    var now = new Date();
    var date = now.getFullYear() + '-' + pad(now.getMonth() + 1) + '-' + pad(now.getDate());
    $('#clock-date').text(date).attr('datetime', date);
  }

  function updateTime() {
    var now = new Date();
    var time = pad(now.getHours()) + ':' + pad(now.getMinutes()) + ':' + pad(now.getSeconds());
    $('#clock-time').text(time).attr('datetime', time);
  }

  function formatHour(unixSeconds) {
    var date = new Date(unixSeconds * 1000);
    return date.getHours() + 'h' + pad(date.getMinutes());
  }

  function plural(value, unit) {
    return value + ' ' + unit + (value === 1 ? '' : 's') + ' ago';
  }

  function elapsedText(since) {
    var seconds = Math.floor((Date.now() - since) / 1000);
    if (seconds < 60) {
      return plural(seconds, 'second');
    }
    if (seconds < 3600) {
      return plural(Math.floor(seconds / 60), 'minute');
    }
    return plural(Math.floor(seconds / 3600), 'hour');
  }

  function updateWeatherElapsed() {
    if (weatherFetchedAt !== null) {
      $('#weather-updated').text(elapsedText(weatherFetchedAt));
    }
  }

  function showWeatherError(message) {
    $('#weather-error').text(message).prop('hidden', false);
  }

  function showWeather(data) {
    $('#weather-temperature').text(data.main.temp.toFixed(2) + ' °C');
    $('#weather-temperature-max').text(data.main.temp_max.toFixed(2) + ' °C');
    $('#weather-temperature-min').text(data.main.temp_min.toFixed(2) + ' °C');
    $('#weather-humidity').text(data.main.humidity + '%');
    $('#weather-sunrise').text(formatHour(data.sys.sunrise));
    $('#weather-sunset').text(formatHour(data.sys.sunset));
    weatherFetchedAt = Date.now();
    updateWeatherElapsed();
  }

  function fetchWeather() {
    var city = $.trim($('#weather-city').val());
    $('#weather-error').prop('hidden', true);

    if (!WEATHER_API_KEY || WEATHER_API_KEY === 'YOUR_API_KEY') {
      showWeatherError('Missing API key: set OPENWEATHER_API_KEY in js/config.js.');
      return;
    }
    if (!city) {
      return;
    }

    $('#weather-get').prop('disabled', true);
    $.getJSON(WEATHER_URL, { units: 'metric', q: city, appid: WEATHER_API_KEY })
      .done(showWeather)
      .fail(function(xhr) {
        var message = xhr.responseJSON && xhr.responseJSON.message;
        showWeatherError('Could not fetch the weather' + (message ? ': ' + message : '.'));
      })
      .always(function() {
        $('#weather-get').prop('disabled', false);
      });
  }

  function initWeather() {
    $('#weather-form').on('submit', function(event) {
      event.preventDefault();
      fetchWeather();
    });
    fetchWeather();
  }

  function init() {
    initToggles();
    updateTemperatures();
    updateDate();
    updateTime();
    initWeather();
    setInterval(updateTemperatures, TEMPERATURE_INTERVAL);
    setInterval(updateTime, CLOCK_INTERVAL);
    setInterval(updateWeatherElapsed, CLOCK_INTERVAL);
  }

  $(init);

  return {
    updateTemperatures: updateTemperatures,
    updateTime: updateTime,
    fetchWeather: fetchWeather
  };

})(jQuery);
