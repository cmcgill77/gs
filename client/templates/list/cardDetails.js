//TODO:180 need to finish building details page, this stuff is just a placeholder



Template.cardDetails.rendered = function () {
  //var post = singlePost.getCursor().fetch();
  console.log (post)
  var map = L.map('details-map').setView([latitude, longitude], 13);

  var Stamen_Terrain = L.tileLayer('http://{s}.tile.stamen.com/terrain/{z}/{x}/{y}.png', {
     attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
     subdomains: 'abcd',
     minZoom: 4,
     maxZoom: 18
   });

   Stamen_Terrain.addTo(map);
}

Template.cardDetails.helpers({
  detailsCommentID: function () {
    return this._id
  },

    body: function() {
        return this.body;
    }
});
