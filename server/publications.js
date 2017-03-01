Meteor.publish('posts', function(options) {
  check(options, {
    sort: Object,
    limit: Number
  });
  return Posts.find({}, options);
});

Meteor.publish('singlePost', function(id) {
  check(id, String);
  return Posts.find(id);
});


Meteor.publish('comments', function(postId) {
  check(postId, String);
  return Comments.find({postId: postId});
});

Meteor.publish('notifications', function() {
  return Notifications.find({userId: this.userId, read: false});
});

Meteor.publish ('theFeeds', function() {
    var currentUserId = this.userId;

    return feedsList.find({createdBy: currentUserId});
  });

Meteor.publish ('sources', function() {
    var currentUserId = this.userId;
    return Sources.find({createdBy: currentUserId});
});

Meteor.publish('postsBySource', function(author){
  return Posts.find();
});

Meteor.publish ('postList', function() {
    var currentUserId = this.userId;

    return Posts.find();
  });
