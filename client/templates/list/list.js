//TODO:30 add some additional filters / facets to search options
//TODO:10 add a simple time-series graph to summarize data in current view

//Meteor.subscribe('postList');

Template.list.rendered = function() {

    //click on search sort type
    $('#newest-sort').trigger('click');
    //graph toggle button
    $( "#graph-button" ).click(function() {
      $( "#list-graph" ).toggle();
      console.log('graph button clicked')
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
    listGraphIndex: () => ListGraphIndex,



  searchIndexes: function() {
    return [ListIndex, ListGraphIndex]},



    listSearchResults: function () {

    },
    updateListGraph: function () {
      listGraph.update();
    },
    searchCount: () => {
      // index instanceof EasySearch.index
      let dict = ListIndex.getComponentDict(/* optional name */)

      // get the total count of search results, useful when displaying additional information
      if (dict.get('count') > 0) {
      return dict.get('count')
    }
    },
    graphData: function () {
      var graphData = [];
      graphData.push(this.author);
      console.log(graphData)
      return graphData
    }
})
Template.list.events({
    'click .sorting': (e) => {
        ListIndex.getComponentMethods()
            .addProps('sortBy', $(e.target).val())
        ListGraphIndex.getComponentMethods()
            .addProps('sortBy', $(e.target).val())
    },
    'click #graph-button': function() {
      var results = ListGraphIndex.getComponentMethods().getCursor().fetch()
      console.log(results)
    }
})
