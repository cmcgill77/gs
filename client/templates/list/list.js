//TODO:30 add some additional filters / facets to search options
//TODO:10 add a simple time-series graph to summarize data in current view

//Meteor.subscribe('postList');

Template.list.rendered = function() {

    //click on search sort type
    $('#newest-sort').trigger('click');
    //graph toggle button
    $( "#graph-button" ).click(function() {
      $( "#list-graph" ).toggle();
    });
    //set up list view graph

    //set the graph width
   var graphWidth = ($(window).width()) - 65

    var listGraph = new Rickshaw.Graph({
    element: document.querySelector("#list-graph"),
    width: graphWidth,
    height: 150,
    //renderer: 'lineplot',
    series: [
    {
      name: "Series 1",
      color: "steelblue",
      data: [{x: 0, y:10,},{x: 1, y:3,},{x: 2, y:8,},{x: 3, y:15,},{x: 4, y:12,},
             {x: 5, y:8,},{x: 6, y:3,},{x: 7, y:5,},{x: 8, y:2,},{x: 9, y:1,},{x: 10, y:4,},
      ]
    }]
  });
  listGraph.render();

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
    listSearchResults: function () {
      console.log(this.title);
    },
    updateListGraph: function () {
      listGraph.update();
    }
})
Template.list.events({
    'click .sorting': (e) => {
        ListIndex.getComponentMethods()
            .addProps('sortBy', $(e.target).val())
    },
    'click #graph-button': function() {
      console.log(listSearchResults)
    }
})
