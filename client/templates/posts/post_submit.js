Template.postSubmit.rendered = function () {
    GoogleMaps.load();



$('#us2').locationpicker({
	location: {latitude: 38.907364, longitude: -77.038427},
	radius: 0,
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

  };

Template.postSubmit.events({
  'submit form': function(event) {
    event.preventDefault();
    var post = {
      postTitle : event.target.title.value,
      postURL : event.target.url.value,
      postBody : event.target.body.value,
      postLocation : event.target.address.value,
      postLatitude : event.target.lat.value,
      postLongitude: event.target.lon.value,
      geo: true
    }
    Meteor.call('insertUserPost', post);

  }
})


Template.postSubmit.created = function() {
  Session.set('postSubmitErrors', {});
}

Template.postSubmit.helpers({
  errorMessage: function(field) {
    return Session.get('postSubmitErrors')[field];
  },
  errorClass: function (field) {
    return !!Session.get('postSubmitErrors')[field] ? 'has-error' : '';
  }
});
