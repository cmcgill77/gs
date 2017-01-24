Meteor.subscribe('sources');
Meteor.subscribe('postsBySource');

Template.sources.helpers({
  'listSources': function(){
      var currentUserId = Meteor.userId();
      return Sources.find();
  },
  'postsBySource': function() {
    return Posts.find({author: this.author});
  },
  'postCount': function() {
    return Posts.find({author: this.author}).count();
  },
  'sourceID': function () {
    return this.author
  },
  'sourceType': function(){
    var typeId = this.type;
    if (typeId === 'RSS') {
      return "Rss_Icon.png"
    }
    else if (typeId === 'twitter') {
      return "Twitter_icon_blue.png"
    }
    else {
      return "Instagram_icon_flat.png"
    }
  }
});
