Template.header.helpers({
  activeRouteClass: function(/* route names */) {
    var args = Array.prototype.slice.call(arguments, 0);
    args.pop();
    
    var active = _.any(args, function(name) {
      return Router.current() && Router.current().route.getName() === name
    });
    
    return active && 'active';
  }
});

Template.header.events({
  'click .filterToggle': function (event) {
    event.preventDefault();
    console.log('clicked feed toggle');
    if (filter.style.display === 'none') {
      filter.style.display = 'block'
    }
    else
      filter.style.display = 'none';
  }
});