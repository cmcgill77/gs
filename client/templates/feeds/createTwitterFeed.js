/* Template.createTwitterFeed.rendered = function () {
    GoogleMaps.load();



$('#us2').locationpicker({
	location: {latitude: 38.907364, longitude: -77.038427},
	radius: 300,
	inputBinding: {
        latitudeInput: $('#lat'),
        longitudeInput: $('#lon'),
        radiusInput: $('#radius'),
        locationNameInput: $('#address')
    },
  enableAutocomplete: false,
  enableReverseGeocode: true,
	});
  $('us2-dialog').on('Modal.show', function () {
    $('#us2').locationpicker('autosize');
  });

  }; */

//TODO:140 improve twitter feed creation form to help user with twitter's advanced operators
//TODO:100 feed preview function to display a sample of data that these feed parameters will return
//TODO:150 location picker controls are pretty crappy, need to do something better

Template.createTwitterFeed.events({
    'submit form': function(event) {
        event.preventDefault();

        var feed = {
            feedNameVar: event.target.inputName.value,
            feedTypeVar: 'Twitter',
            feedQueryVar: event.target.textArea.value,
            locationCheckVar: event.target.locationCheck.value,
            feedLocationVar: event.target.address.value,
            feedLatitudeVar: event.target.lat.value,
            feedLongitudeVar: event.target.lon.value,
            feedRadiusVar: event.target.radius.value,

        }

        if (document.getElementById('locationCheck').checked) {
            console.log('checked');
            var isLocationBased = true;
            console.log(isLocationBased)
            Meteor.call('insertFeedData', feed, isLocationBased);
        } else {
            console.log('unchecked');
            var isLocationBased = false;
            console.log(isLocationBased)

            Meteor.call('insertFeedData', feed, isLocationBased);
        }



        //Meteor.call('insertFeedData', feedNameVar, feedTypeVar, feedQueryVar);
        Router.go('feedsList');
    },

    'click .checkbox': function() {


        if (locationControls.style.display == 'block')
            locationControls.style.display = 'none';
        else {
            locationControls.style.display = 'block';
            throwError("Limiting your search by location will exclue ALL tweets which do not explicity contain location information.  For best results use a mix of keyword only and location based searches.");
        }

        if (mapControls.style.display === 'block')
            mapControls.style.display = 'none';
        else {
            mapControls.style.display = 'block';

            GoogleMaps.load();

            $('#us2').locationpicker({
                location: {
                    latitude: 38.907364,
                    longitude: -77.038427
                },
                radius: 300,
                inputBinding: {
                    latitudeInput: $('#lat'),
                    longitudeInput: $('#lon'),
                    radiusInput: $('#radius'),
                    locationNameInput: $('#address')
                },
                enableAutocomplete: false,
                enableReverseGeocode: true,
            });
            $('us2-dialog').on('Modal.show', function() {
                $('#us2').locationpicker('autosize');
            });
        }
    },

    'reset form': function() {
        if (locationControls.style.display == 'block')
            locationControls.style.display = 'none';

        if (mapControls.style.display == 'block')
            mapControls.style.display = 'none';
    }
});
