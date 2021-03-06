
//TODO:250 should probably turn verification color into some sort of universal helper considering the number of times something similar is needed

var POST_HEIGHT = 80;
var Positions = new Meteor.Collection(null);

Template.post_card.rendered = function() {
var currentPost = (Template.currentData())
    $("#open-info-"+currentPost.__originalId).on('click', function() {
        $('div.card-reveal[data-rel=' + $(this).data('rel') + ']').slideToggle('slow');
    });

    $("#close-info-"+currentPost.__originalId).on('click', function() {
        $('div.card-reveal[data-rel=' + $(this).data('rel') + ']').slideToggle('slow');
    });

    this.$('[data-toggle="tooltip"]').tooltip();
    this.$('[data-toggle="popover"]').popover();
}

Template.post_card.helpers({
    'sourceType': function() {
        var typeId = this.type;
        //console.log('typeId')
        if (typeId === 'RSS') {
            return "fa-rss"
        } else if (typeId === 'twitter') {
            return "fa-twitter"
        } else {
            return "fa-instagram"
        }
    },
    'getVerificationValues': function () {
      for (i=0; i < this.verificationSteps.count; i++) {
        return this.verificationSteps[i]
      }
    },

    'verificationStepColor': function (value) {
      if (value > 0 && value <= 10) {
          return 'verification-level-1';
      } else if (value > 10 && value <= 19) {
          return 'verification-level-2';
      } else if (value > 19 && value <= 29) {
          return 'verification-level-3';
      } else if (value > 29 && value <= 39) {
          return 'verification-level-4';
      } else if (value > 39 && value <= 49) {
          return 'verification-level-5';
      } else if (value > 49 && value <= 59) {
          return 'verification-level-6';
      } else if (value > 59 && value <= 69) {
          return 'verification-level-7';
      } else if (value > 69 && value <= 79) {
          return 'verification-level-8';
      } else if (value > 79 && value <= 89) {
          return 'verification-level-9';
      } else if (value > 89 && value <= 100) {
          return 'verification-level-10';
      } else {
          return 'unverified';
      }
    },

    'verificationColor': function() {
        if (this.verificationScore > 0 && this.verificationScore <= 10) {
            return 'verification-level-1';
        } else if (this.verificationScore > 10 && this.verificationScore <= 19) {
            return 'verification-level-2';
        } else if (this.verificationScore > 19 && this.verificationScore <= 29) {
            return 'verification-level-3';
        } else if (this.verificationScore > 29 && this.verificationScore <= 39) {
            return 'verification-level-4';
        } else if (this.verificationScore > 39 && this.verificationScore <= 49) {
            return 'verification-level-5';
        } else if (this.verificationScore > 49 && this.verificationScore <= 59) {
            return 'verification-level-6';
        } else if (this.verificationScore > 59 && this.verificationScore <= 69) {
            return 'verification-level-7';
        } else if (this.verificationScore > 69 && this.verificationScore <= 79) {
            return 'verification-level-8';
        } else if (this.verificationScore > 79 && this.verificationScore <= 89) {
            return 'verification-level-9';
        } else if (this.verificationScore > 89 && this.verificationScore <= 100) {
            return 'verification-level-10';
        } else {
            return 'unverified';
        }
    },
    locationClass: function() {
        if (this.geolocationType === 'device') {
            return 'green'
        } else if (this.geolocationType === 'place') {
            return 'yellow'
        } else if (this.geolocationType === 'profile') {
            return 'red'
        } else if (this.geo === false) {
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
        var post = _.extend({}, Positions.findOne({
            postId: this._id
        }), this);
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
            Positions.upsert({
                postId: post._id
            }, {
                $set: {
                    position: newPosition
                }
            })
        });

        return attributes;
    }
});

Template.post_card.events({
    'click .upvotable': function(e) {
        e.preventDefault();
        console.log('click')
        Meteor.call('upvote', this._id);
    },
    'click .front': function(e) {
        e.preventDefault();
        console.log('clicked front of card');
        $(this).addClass('hidden');
    }
});
