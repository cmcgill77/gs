Template.createRSSFeed.events({
    'submit form': function(event) {
        event.preventDefault();

        var feed = {
            feedNameVar: event.target.inputName.value,
            feedTypeVar: 'RSS',
            feedQueryVar: event.target.textArea.value,
            locationCheckVar: false,
            feedLocationVar: false,
            feedLatitudeVar: false,
            feedLongitudeVar: false,
            feedRadiusVar: false,
        }

        var isLocationBased = feed.locationCehckVar;
        
        Meteor.call('insertFeedData', feed, isLocationBased);
        Router.go('feedsList');
    }
});
