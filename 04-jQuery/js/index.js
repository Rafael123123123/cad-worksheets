var app = (function($) {
  'use strict';

  var TEMPERATURE_INTERVAL = 5000;
  var CLOCK_INTERVAL = 1000;

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

  function init() {
    initToggles();
    updateTemperatures();
    updateDate();
    updateTime();
    setInterval(updateTemperatures, TEMPERATURE_INTERVAL);
    setInterval(updateTime, CLOCK_INTERVAL);
  }

  $(init);

  return {
    updateTemperatures: updateTemperatures,
    updateTime: updateTime
  };

})(jQuery);
