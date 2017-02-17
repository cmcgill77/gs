var POST_HEIGHT = 80;
var Positions = new Meteor.Collection(null);

Template.postItem.rendered = function () {

   $(function(){

    $('#show').on('click',function(){
        $('.card-reveal').slideToggle('slow');
    });

    $('.card-reveal .close').on('click',function(){
        $('.card-reveal').slideToggle('slow');
    });
});

  this.$('[data-toggle="tooltip"]').tooltip();
  this.$('[data-toggle="popover"]').popover();
  this.$(".card-grid").flip({
    front: '.card-front',
    back: '.card-back'

  });

}

Template.postItem.helpers({
  locationClass: function() {
    if (this.geolocationType === 'device') {
    return 'green'
  }
    else if (this.geolocationType === 'place') {
      return 'yellow'
    }
    else if (this.geolocationType === 'profile') {
      return 'red'
    }
    else if (this.geo === false) {
      return 'hidden'
    }
  },
  ownPost: function() {
    return this.userId == Meteor.userId();
  },
  domain: function() {
    var a = document.createElement('a');
    a.href = this.url;
    return a.hostname;
  },
  upvotedClass: function() {
    var userId = Meteor.userId();
    if (userId && !_.include(this.upvoters, userId)) {
      return 'btn-default upvotable';
    } else {
      return 'disabled';
    }
  },

  attributes: function() {
    var post = _.extend({}, Positions.findOne({postId: this._id}), this);
    var newPosition = post._rank * POST_HEIGHT;
    var attributes = {};

    if (_.isUndefined(post.position)) {
      attributes.class = 'post invisible';
    } else {
      var delta = post.position - newPosition;
      attributes.style = "top: " + delta + "px";
      if (delta === 0)
        attributes.class = "post animate"
    }

    Meteor.setTimeout(function() {
      Positions.upsert({postId: post._id}, {$set: {position: newPosition}})
    });

    return attributes;
  }
});

Template.postItem.events({
  'click .upvotable': function(e) {
    e.preventDefault();
    Meteor.call('upvote', this._id);
  },
  'click .front': function(e) {
    e.preventDefault();
    console.log('clicked front of card');
    $(this).addClass('hidden');
  }
});
