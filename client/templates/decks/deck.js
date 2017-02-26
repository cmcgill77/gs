Template.deck.rendered = function () {
  var map = L.map('timeline-map').setView([33.5074705,36.2477903], 13);

  var Stamen_Terrain = L.tileLayer('http://{s}.tile.stamen.com/terrain/{z}/{x}/{y}.png', {
     attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
     subdomains: 'abcd',
     minZoom: 4,
     maxZoom: 18
   });

   Stamen_Terrain.addTo(map);


L.marker([33.5074705,36.2477903]).addTo(map)
    .bindPopup('Some card info might go here')

}
