(function() {
  var App, BMWClient, bmw_client, buildMap, config;

  BMWClient = this.BMWClient;

  config = {
    application: 'bed2f52f-31d5-427e-bbfb-ebca010de3ed',
    redirect_uri: 'http://localhost',
    hostname: 'data.api.hackthedrive.com',
    version: 'v1',
    port: '443',
    scheme: 'https'
  };

  bmw_client = new BMWClient(config);

  App = bmw_client.model('App');

  $(function() {
    var div;
    if (config.application === '[YOUR APP ID GOES HERE]') {
      div = document.getElementById('result');
      div.innerHTML += 'BMW Error:: Set your application and secret keys in myFirstBMWApp source code.  <br>';
      return;
    }
    if (config.application === '[YOUR REDIRECT URI GOES HERE]') {
      div = document.getElementById('result');
      div.innerHTML += 'BMW Error:: Set a redirect_uri in myFirstBMWApp source code.  <br>';
      return;
    }
    bmw_client.token(function(error, result) {
      if (error) {
        console.log("redirecting to login.");
        return bmw_client.authorize(config.redirect_uri);
      } else {
        alert("Authorization Successful.");
        div = $("#welcome");
        div.html('Authorization Result:<br />');
        div.append(JSON.stringify(result));
        bmw_client.get(bmw_client.model("User"), {
          id: result.UserId
        }, function(error, result) {
          var message;
          message = '<br/><br/>Viewing the location of <strong>';
          if (result.FirstName) {
            message += result.FirstName;
          } else if (result.UserName) {
            message += result.UserName;
          } else if (result.LastName) {
            message += result.LastName;
          } else if (result.Email) {
            message += result.Email;
          } else {
            message += "Unknown";
          }
          message += '</strong>';
          div = $("#welcome");
          return div.append(message);
        });
        return bmw_client.get(bmw_client.model("Vehicle"), {}, function(error, result) {
          var i, lat, lng;
          lat = [];
          lng = [];
          i = 0;
          $.each(result.Data, function(key, value) {
            if ((value.LastLocation != null) && (value.LastLocation.Lat != null) && (value.LastLocation.Lng != null)) {
              lat[i] = value.LastLocation.Lat;
              lng[i] = value.LastLocation.Lng;
              return i++;
            }
          });
          div = $("#result");
          if (lat.length > 0) {
            div.html('The vehicle is at: ' + lat[0] + ", " + lng[0]);
            return buildMap(lat[0], lng[0]);
          } else {
            return div.html("No vehicle detected!");
          }
        });
      }
    });
    return $("#button").click(function() {
      return bmw_client.unauthorize(config.redirect_uri);
    });
  });

  buildMap = function(lat, lng) {
    var map;
    map = new GMaps({
      el: '#map',
      lat: lat,
      lng: lng,
      panControl: false,
      streetViewControl: false,
      mapTypeControl: false,
      overviewMapControl: false
    });
    return setTimeout(function() {
      return map.addMarker({
        lat: lat,
        lng: lng,
        animation: google.maps.Animation.DROP,
        draggable: false,
        title: 'Current Location'
      }, 1000);
    });
  };

}).call(this);

//# sourceMappingURL=myFirstBMWApp.js.map
