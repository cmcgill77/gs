Meteor.subscribe('theFeeds');

Template.feedsList.helpers({
  'list': function(){
      var currentUserId = Meteor.userId();
      return feedsList.find({}, {sort: {score: -1, name: 1}});
  },

  'selectedClass': function(){
    var feedId = this._id;
    var selectedFeed = Session.get('selectedFeed');
    if (feedId === selectedFeed) {
      return "selected"
    }
    },

  'feedType': function(){
    var typeId = this.type;
    if (typeId === 'RSS') {
      return "Rss_Icon.png"
    }
    else if (typeId === 'Twitter') {
      return "Twitter_icon_blue.png"
    }
    else {
      return "Instagram_icon_flat.png"
    }
  },

  'showSelectedFeed': function () {
    var currentUserId = Meteor.userId();
    var selectedFeed = Session.get('selectedFeed');
    return feedsList.findOne(selectedFeed)
  }

});


Template.feedsList.events({
  'click .feed': function () {
    var feedId = this._id;
    Session.set('selectedFeed', feedId);
  },

  'click .increment': function () {
    var selectedFeed = Session.get('selectedFeed');
    Meteor.call('modifyFeedScore', selectedFeed, 5)
  },

  'click .decrement': function () {
    var selectedFeed = Session.get('selectedFeed');
    Meteor.call('modifyFeedScore', selectedFeed, -5)
  },

  'click .remove': function () {
    var selectedFeed = Session.get('selectedFeed');
    Meteor.call('removeFeedData', selectedFeed);
  },

  'click .newFeedButton': function (event) {
    event.preventDefault();
    Router.go('createFeed')
   },

  'click .run': function (event) {
    event.preventDefault();
    var selectedFeed = Session.get('selectedFeed');
    var typeId = this.type;
    if (typeId === 'Twitter') {
    Meteor.call('twitterQuery', selectedFeed);
    }
    else if (typeId === 'RSS') {
    Meteor.call('RSSQuery', selectedFeed);
    }
  }
})
