//TODO add UI and methods for editing documents of all kinds

Posts = new Mongo.Collection('posts');

Posts.allow({
    update: function(userId, post) {
        return ownsDocument(userId, post);
    },
    remove: function(userId, post) {
        return ownsDocument(userId, post);
    },
});

Posts.deny({
    update: function(userId, post, fieldNames) {
        // may only edit the following two fields:
        return (_.without(fieldNames, 'url', 'title', 'body').length > 0);
    }
});

Posts.deny({
    update: function(userId, post, fieldNames, modifier) {
        var errors = validatePost(modifier.$set);
        return errors.title || errors.url;
    }
});

validatePost = function(post) {
    var errors = {};

    if (!post.title)
        errors.title = "Please fill in a headline";

    if (!post.url)
        errors.url = "Please fill in a URL";

    return errors;
}

Meteor.methods({
    postInsert: function(postAttributes) {
        check(this.userId, String);
        check(postAttributes, {
            title: String,
            url: String,
            body: String

        });

        var errors = validatePost(postAttributes);
        if (errors.title || errors.url)
            throw new Meteor.Error('invalid-post', "You must set a title and URL for your post");

        var postWithSameLink = Posts.findOne({
            url: postAttributes.url
        });
        if (postWithSameLink) {
            return {
                postExists: true,
                _id: postWithSameLink._id
            }
        }

        var user = Meteor.user();
        var post = _.extend(postAttributes, {
            userId: user._id,
            author: user.username,
            submitted: new Date(),
            commentsCount: 0,
            upvoters: [],
            votes: 0
        });

        var postId = Posts.insert(post);

        return {
            _id: postId
        };
    },

    insertUserPost: function(post) {

        var owner = Meteor.user();

        Posts.insert({
            userId: owner._id,
            author: owner.username,
            submitted: new Date(),
            commentsCount: 0,
            upvoters: [],
            votes: 0,
            title: post.postTitle,
            url: post.postURL,
            body: post.postBody,
            tags: [],
            type: 'user',
            location: post.postLocation,
            latitude: post.postLatitude,
            longitude: post.postLongitude,
            image: 'new_report.PNG',
            geo: post.geo
        });
        Router.go('/new');
    },

    upvote: function(postId) {
        check(this.userId, String);
        check(postId, String);

        var affected = Posts.update({
            _id: postId,
            upvoters: {
                $ne: this.userId
            }
        }, {
            $addToSet: {
                upvoters: this.userId
            },
            $inc: {
                votes: 1
            }
        });

        if (!affected)
            throw new Meteor.Error('invalid', "You weren't able to flag that post");
    }
});
