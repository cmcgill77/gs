//TODO need to build details page, this stuff is just a placeholder

Template.cardDetails.helpers({
    comments: function() {
        return Comments.find({
            postId: this._id
        });
    },
    body: function() {
        return this.body;
    }
});
