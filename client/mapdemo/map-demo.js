//this is just a bit of boilerplate to initialize google maps on client load, using a set API key for now, but see below
//currently using google maps for the location-picker type UI's since geocoding results seem better than nominatum

if (Meteor.isClient) {
  Meteor.startup(function() {
    GoogleMaps.load( {
        v: '3', key: 'AIzaSyCVE8R3AYOX8X-CD3zJ_uO0a5lmzrTdgPg'
      }
    );
  });

//TODO user settings to provide api keys to use, per user
//TODO user setting to specify where maps should be centered for each user


  Template.body.helpers({
    exampleMapOptions: function() {
      // Make sure the maps API has loaded
      if (GoogleMaps.loaded()) {
        // Map initialization options
        return {
          center: new google.maps.LatLng(-37.8136, 144.9631),
          zoom: 8
        };
      }
    }
  });

  Template.body.onCreated(function() {
    // We can use the `ready` callback to interact with the map API once the map is ready.
    GoogleMaps.ready('exampleMap', function(map) {
      // Add a marker to the map once it's ready
      var marker = new google.maps.Marker({
        position: map.options.center,
        map: map.instance
      });
    });
  });
}
