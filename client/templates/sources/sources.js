Meteor.subscribe('sources');
Meteor.subscribe('postsBySource');

Template.sources.rendered = function () {
  
  Session.set('selectedSource', '');
  Session.set('selectedName', '');
  Session.set('graphClicked', false)
}

Template.sources.helpers({
  'listSources': function(){
      var currentUserId = Meteor.userId();
      return Sources.find();
  },
  'postsBySource': function() {
    return Posts.find({author: this.author});
  },
  'selectedClass': function(){
    var sourceId = this._id;
    var selectedSource = Session.get('selectedSource');
    if (sourceId === selectedSource) {
      return "selected"
    }
    },
  'showSelectedPosts': function () {
    var currentUserId = Meteor.userId();
    var selectedSource = Session.get('selectedSource');
    var selectedName = Session.get('selectedName');
    return Posts.find({author: selectedName});
  },
  'postCount': function() {
    return Posts.find({author: this.author}).count();
  },
  'showGraph': function() {
    if (Session.get('graphClicked') === true) {
      return 'visible'
    }
    else return 'hidden'


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

Template.sources.events({
  'click .source': function () {
    var sourceId = this._id;
    var sourceName = this.author;
    console.log(sourceId);
    Session.set('selectedSource', sourceId);
    Session.set('selectedName', sourceName)
  },
  'click .graph-button': function () {
    //var graphClicked = True;
    Session.set('graphClicked', true);
  }
})
