
Template.postVerify.rendered = function () {

  $(document).ready(function () {

    score = [0,0,0,0];
    rating = 0;

    $(".scale").hover (function(event) {
      $("#" + event.target.id).toggleClass("check");
    });

    // get scale value on click
    $(".scale").click (function(event) {

        var value = (event.target.id);
        var step = value.slice(5,6);
        var scale = value.slice(13,14);

                score[step-1] = parseInt(scale);
        $(this).addClass("selectedScale").siblings().removeClass("selectedScale");
        //$("#" + value).toggleClass("selectedScale");
        rating = (score[0] + score[1] + score[2] + score[3]) * 5;

        Session.set('currentRating', rating)

        console.log(step);
        console.log(scale);
        console.log(score);
        console.log(rating);
    });

    //set help toggles
    $( "#verify-help-icon1" ).click(function() {
      $( "#help-text1" ).toggle();
    });

    $( "#verify-help-icon2" ).click(function() {
      $( "#help-text2" ).toggle();
    });

    $( "#verify-help-icon3" ).click(function() {
      $( "#help-text3" ).toggle();
    });

    $( "#verify-help-icon4" ).click(function() {
      $( "#help-text4" ).toggle();
    });

    //set toggles for scale help text

    //step 1 scales
    $( "#step-1-scale-1" ).hover(function() {
      $( "#step-1-scale-1-help" ).toggle();
    });

    $( "#step-1-scale-3" ).hover(function() {
      $( "#step-1-scale-3-help" ).toggle();
    });

    $( "#step-1-scale-5" ).hover(function() {
      $( "#step-1-scale-5-help" ).toggle();
    });

    $( ".scale-4" ).hover(function() {
      $( ".scale-4-help" ).toggle();
    });

    $( ".scale-5" ).hover(function() {
      $( ".scale-5-help" ).toggle();
    });

    //step 2 scales
    $( "#step-2-scale-1" ).hover(function() {
      $( "#step-2-scale-1-help" ).toggle();
    });

    $( "#step-2-scale-2" ).hover(function() {
      $( "#step-2-scale-2-help" ).toggle();
    });

    $( "#step-2-scale-3" ).hover(function() {
      $( "#step-2-scale-3-help" ).toggle();
    });

    $( "#step-2-scale-4" ).hover(function() {
      $( "#step-2-scale-4-help" ).toggle();
    });

    $( "#step-2-scale-5" ).hover(function() {
      $( "#step-2-scale-5-help" ).toggle();
    });

    //step 3 scales
    $( "#step-3-scale-1" ).hover(function() {
      $( "#step-3-scale-1-help" ).toggle();
    });

    $( "#step-3-scale-2" ).hover(function() {
      $( "#step-3-scale-2-help" ).toggle();
    });

    $( "#step-3-scale-3" ).hover(function() {
      $( "#step-3-scale-3-help" ).toggle();
    });

    $( "#step-3-scale-4" ).hover(function() {
      $( "#step-3-scale-4-help" ).toggle();
    });

    $( "#step-3-scale-5" ).hover(function() {
      $( "#step-3-scale-5-help" ).toggle();
    });

    //step 4 scales
    $( "#step-4-scale-1" ).hover(function() {
      $( "#step-4-scale-1-help" ).toggle();
    });

    $( "#step-4-scale-2" ).hover(function() {
      $( "#step-4-scale-2-help" ).toggle();
    });

    $( "#step-4-scale-3" ).hover(function() {
      $( "#step-4-scale-3-help" ).toggle();
    });

    $( "#step-4-scale-4" ).hover(function() {
      $( "#step-4-scale-4-help" ).toggle();
    });

    $( "#step-4-scale-5" ).hover(function() {
      $( "#step-4-scale-5-help" ).toggle();
    });


    //Initialize tooltips
    $('.nav-tabs > li a[title]').tooltip();

    //Wizard
    $('a[data-toggle="tab"]').on('show.bs.tab', function (e) {

        var $target = $(e.target);

        if ($target.parent().hasClass('disabled')) {
            return false;
        }
    });

    $(".next-step").click(function (e) {

        var $active = $('.wizard .nav-tabs li.active');
        $active.next().removeClass('disabled');
        nextTab($active);

    });
    $(".prev-step").click(function (e) {

        var $active = $('.wizard .nav-tabs li.active');
        prevTab($active);

    });
});

function nextTab(elem) {
    $(elem).next().find('a[data-toggle="tab"]').click();
}
function prevTab(elem) {
    $(elem).prev().find('a[data-toggle="tab"]').click();
}

}

Template.postVerify.helpers({
  'compositeScore': function(){
      var currentUserId = Meteor.userId()},

  'postBody': function() {
    return this.body;
  },

  'postRating': function() {
    rating = Session.get('currentRating');
    return rating;
  },

  'postType': function() {
    var typeDescription = 'This report was collected via ' + this.type + ' by ' + this.author;
    return typeDescription;
  },

  'locationInfo1': function() {
    var streetView = '';
    var StreetViewKey = 'AIzaSyCVE8R3AYOX8X-CD3zJ_uO0a5lmzrTdgPg';
    if (this.geo = true) {
        streetView = {
          view1: 'https://maps.googleapis.com/maps/api/streetview?size=380x300&location=' + this.latitude + ',' + this.longitude +'&heading=0&pitch=-0.76&key='+StreetViewKey,
          view2: 'https://maps.googleapis.com/maps/api/streetview?size=380x300&location=' + this.latitude + ',' + this.longitude +'&heading=90&pitch=-0.76&key='+StreetViewKey,
          view3: 'https://maps.googleapis.com/maps/api/streetview?size=380x300&location=' + this.latitude + ',' + this.longitude +'&heading=180&pitch=-0.76&key='+StreetViewKey,
          view4: 'https://maps.googleapis.com/maps/api/streetview?size=380x300&location=' + this.latitude + ',' + this.longitude +'&heading=270&pitch=-0.76&key='+StreetViewKey
        }
        console.log(streetView);
    }
    else
      streetView = 'No Location Data Available';
      console.log('no geodata for post');
    return streetView;
  },

});

Template.postVerify.events({
  'submit form': function(event) {
    event.preventDefault();

    var verificationData = {
      postId : this._id,
      verificationScore : Session.get ('currentRating')

      }



      Meteor.call('addVerificationData', verificationData);


    Router.go('home');

  }




});
