//defines all the application's routes
//TODO a lot of this logic can be moved to templates, will help if I ever want to migrate from iron-router

Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  notFoundTemplate: 'notFound',
  waitOn: function() {
    return [Meteor.subscribe('notifications')]
  }
});

//TODO posts controllers can be removed once search is fully implemented

PostsListController = RouteController.extend({
  template: 'postsList',
  increment: 12,
  postsLimit: function() {
    return parseInt(this.params.postsLimit) || this.increment;
  },
  findOptions: function() {
    return {sort: this.sort, limit: this.postsLimit()};
  },
  subscriptions: function() {
    this.postsSub = Meteor.subscribe('posts', this.findOptions());
  },
  posts: function() {
    return Posts.find({}, this.findOptions());
  },
  data: function() {
    var hasMore = this.posts().count() === this.postsLimit();
    return {
      posts: this.posts(),
      ready: this.postsSub.ready,
      nextPath: hasMore ? this.nextPath() : null
    };
  }
});

NewPostsController = PostsListController.extend({
  sort: {submitted: -1, _id: -1},
  nextPath: function() {
    return Router.routes.newPosts.path({postsLimit: this.postsLimit() + this.increment})
  }
});

BestPostsController = PostsListController.extend({
  sort: {votes: -1, submitted: -1, _id: -1},
  nextPath: function() {
    return Router.routes.bestPosts.path({postsLimit: this.postsLimit() + this.increment})
  }
});

Router.route('/', {
  template: 'list'
});

Router.route('/new/:postsLimit?', {name: 'newPosts'});

Router.route('/best/:postsLimit?', {name: 'bestPosts'});

//original details route
Router.route('/posts/:_id', {
  name: 'postPage',
  waitOn: function() {
    return [
      Meteor.subscribe('singlePost', this.params._id)

    ];
  },
  data: function() { return Posts.findOne(this.params._id); }
});

//new details route
Router.route('/cardDetails/:__originalId', {
  name: 'cardDetails',
  waitOn: function() {
    return [
      Meteor.subscribe('singlePost', this.params.__originalId)

    ];
  },
  data: function() {
    var postID = this.params.__originalId
    return Posts.findOne(this.params.__originalId); }

});

//original edit route
Router.route('/posts/:_id/edit', {
  name: 'postEdit',
  waitOn: function() {
    return Meteor.subscribe('singlePost', this.params._id);
  },
  data: function() { return Posts.findOne(this.params._id); }
});

//new edit route

Router.route('/posts/:__originalId/cardEdit', {
  name: 'cardEdit',
  waitOn: function() {
    return Meteor.subscribe('singlePost', this.params.__originalId);
  },
  data: function () {return Posts.findOne(this.params.__originalId);
  }
});

//original verify route
Router.route('/posts/:_id/postVerify', {
  name: 'postVerify',
  waitOn: function() {
    return Meteor.subscribe('singlePost', this.params._id);
  },
  data: function() { return Posts.findOne(this.params._id); }
});

//new verify route
Router.route('/posts/:__originalId/postListVerify', {
  name: 'postListVerify',
  waitOn: function() {
    return Meteor.subscribe('singlePost', this.params.__originalId);
  },
  data: function() { return Posts.findOne(this.params.__originalId); }
});

Router.route('/submit', {name: 'postSubmit'});

Router.route('/feedsList', {name: 'feedsList'});

Router.route('/list', {name: 'list'});

Router.route('/sources', {
  name: 'sources'
});

Router.route('/deck', {name: 'deck'});

Router.route('/createFeed', {name: 'createFeed'});

Router.route('/verifyPost', {name: 'verifyPost'});

Router.route('/map', {
  name: 'map',
//TODO map markers are not reactive at the moment, probably need to create a cursor / observe function to update markers as they are added and deleted
//TODO look at implmenting map search and filtering, preferrably using easy-search
//TODO get leaflet-extra-markers working, stopped working after implementing marker clusters
  // data parameter not working seems to be getting overwritten by options variable on the posts supscription --see publications.js  maybe create and set some options there for the map view
  data: function() { return Posts.find().fetch(); },

  action: function() {
    this.render('map');
    Template.map.rendered = function() {
    // create a map in the "map" div, set the view to a given place and zoom
    var map = L.map('mapcanvas').setView([38.897, -77.041], 12);

    var sidebar = L.control.sidebar('sidebar', {
        position: 'right',
        autoPan: false
    });

    map.addControl(sidebar);

   // add an OpenStreetMap tile layer

   var Stamen_Terrain = L.tileLayer('http://{s}.tile.stamen.com/terrain/{z}/{x}/{y}.png', {
	    attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
	    subdomains: 'abcd',
	    minZoom: 3,
	    maxZoom: 24
    });

    Stamen_Terrain.addTo(map);
    L.terminator().addTo(map);

    require('leaflet.markercluster');
    require('leaflet-extra-markers');

  //L.Control.geocoder().addTo(map);
  // add a marker in the given location, attach some popup content to it and open the popup
   var mapposts = Posts.find({geo: true}).fetch();



  //  var twitterMarker = L.AwesomeMarkers.icon({
  //   icon: 'twitter',
  //   markerColor: 'blue',
  //   prefix: 'fa'
  //
  // });
  //
  //   var userMarker = L.AwesomeMarkers.icon({
  //   icon: 'file-text-o',
  //   markerColor: 'green',
  //   prefix: 'fa'
  //
  // });

   console.log(mapposts);
   console.log(mapposts.length);


  //  for (i = 0; i < mapposts.length; i++) {
   //
  //    if (mapposts[i].type === 'twitter') {
  //      var mapIcon = twitterMarker;
  //    }
  //    else if (mapposts[i].type === 'user') {
  //      mapIcon = userMarker;
  //    }
   //
  //  L.marker([mapposts[i].latitude, mapposts[i].longitude], {icon: mapIcon}).addTo(map)
  //   .bindPopup(mapposts[i].title + '<br>' + mapposts[i].url)
  //  }
  var mapIcon = {};
  var markers = new L.markerClusterGroup();

  for (var i = 0; i < mapposts.length; i++) {

       if (mapposts[i].type === 'twitter') {
         var mapIcon = L.ExtraMarkers.icon({
            icon: 'fa-twitter',
            markerColor: 'cyan',
            shape: 'circle',
            prefix: 'fa'

          });
       }
       else if (mapposts[i].type === 'user') {
            var mapIcon = L.ExtraMarkers.icon({
              icon: 'file-text-o',
              markerColor: 'green',
              shape: 'circle',
              prefix: 'fa'

          });
        }

    var a = mapposts[i];
    var title = a.title + '<br>' + a.url;
    var marker = L.marker(new L.latLng(a.latitude, a.longitude), {_id: a._id}, { title: a.title }, {icon: mapIcon}).on('click', function () {
            sidebar.show();

            //get post to display in map card
            if (Meteor.isClient) {
              var selectedID = this.options._id;
              console.log (this.options._id);
              obj = _.find(mapposts, function(obj) {return obj._id === selectedID})
              console.log (obj);
              Session.set('postID', obj);
            }
        });


    //marker.bindPopup(mapCard);
    markers.addLayer(marker);
  }

  map.addLayer(markers);
  map.on('click', function () {
            sidebar.hide();
        });

    Template.map.rendered = null;

   };
  }
});

Router.route('/feed.xml', {
  where: 'server',
  name: 'rss',
  action: function() {
    var feed = new RSS({
      title: "E360 OSINT feed",
      description: "The latest reports from E360 OSINT platform"
    });

    Posts.find({}, {sort: {submitted: -1}, limit: 20}).forEach(function(post) {
      feed.item({
        title: post.title,
        description: post.body,
        author: post.author,
        date: post.submitted,
        url: '/posts/' + post._id
      })
    });

    this.response.write(feed.xml());
    this.response.end();
  }
});

//TODO may need to return a bit more info with this method
//TODO more API methods, possibly use simple-rest library
Router.route('/api/posts', {
  where: 'server',
  name: 'apiPosts',
  action: function() {
    var parameters = this.request.query,
        limit = !!parameters.limit ? parseInt(parameters.limit) : 20,
        data = Posts.find({}, {limit: limit}).fetch();

    this.response.write(JSON.stringify(data));
    this.response.end();
  }
});

Router.route('/api/posts/:_id', {
  where: 'server',
  name: 'apiPost',
  action: function() {
    var post = Posts.findOne(this.params._id);

    if(post){
      this.response.write(JSON.stringify(post));
    } else {
      this.response.writeHead(404, {'Content-Type': 'text/html'});
      this.response.write("Post not found.");
    }
    this.response.end();
  }
});

var requireLogin = function() {
  if (! Meteor.user()) {
    if (Meteor.loggingIn()) {
      this.render(this.loadingTemplate);
    } else {
      this.render('accessDenied');
    }
  } else {
    this.next();
  }
}

if (Meteor.isClient) {
  Router.onBeforeAction('dataNotFound', {only: 'postPage'});
  Router.onBeforeAction(requireLogin, {only: 'postSubmit'});
}
