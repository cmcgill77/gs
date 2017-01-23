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
  }
});
