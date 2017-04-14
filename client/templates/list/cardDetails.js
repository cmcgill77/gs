//TODO:180 need to finish building details page, this stuff is just a placeholder



Template.cardDetails.rendered = function () {

 //var postData = Posts.find({_id: postID}).fetch();

  var currentPost = (Template.currentData())
  console.log (currentPost)
  var map = L.map('details-map').setView([currentPost.latitude, currentPost.longitude], 15);

  var Stamen_Terrain = L.tileLayer('http://{s}.tile.stamen.com/terrain/{z}/{x}/{y}.png', {
     attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
     subdomains: 'abcd',
     minZoom: 4,
     maxZoom: 18
   });

   Stamen_Terrain.addTo(map);

   if (currentPost.type === 'twitter') {
     var mapIcon = L.ExtraMarkers.icon({
       icon: 'fa-twitter',
       markerColor: 'cyan',
       shape: 'circle',
       prefix: 'fa'
     })

      }

   else if (currentPost.type === 'user') {
        var mapIcon = L.ExtraMarkers.icon({
          icon: 'file-text-o',
          markerColor: 'green',
          shape: 'circle',
          prefix: 'fa'

      });
    }

   //var detailMarker = L.marker([currentPost.latitude, currentPost.longitude]).addTo(map);

   L.marker([currentPost.latitude, currentPost.longitude], {icon: mapIcon}).addTo(map)


}

Template.cardDetails.helpers({
  detailsCommentID: function () {

    return this._id
  },

    body: function() {
        return this.body;
    }



    });
