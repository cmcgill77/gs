//TODO:30 add some additional filters / facets to search options
//TODO:10 add a simple time-series graph to summarize data in current view

Meteor.subscribe('postList');

Template.list.rendered = function() {
    //click on search sort type
    $('#newest-sort').trigger('click');
}
Template.list.helpers({
    postsList: function() {
        return Posts.find().fetch();
    },
    inputAttributes: () => {
        return {
            placeholder: 'Search...',
            type: 'text',
        }
    },
    loadMoreAttributes: () => {
        return {
            class: 'btn btn-link load-more-button',
        }
    },
    loadMoreIcon: () => '<i class="fa fa-chevron-down" aria-hidden="true"></i>',
    listIndex: () => ListIndex,
})
Template.list.events({
    'click .sorting': (e) => {
        ListIndex.getComponentMethods()
            .addProps('sortBy', $(e.target).val())
    },
    'click #graph-button': function (e) {
      e.preventDefault();
      console.log('clicked graph-list button');
      $("div.graph-list").toggleClass("graph-show");
    }
})
