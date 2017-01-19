Meteor.subscribe('Posts');

Template.map.helpers ({
  'getPostbyID': function(){
    var Id = Session.get('postID')
    console.log (Id);
    return Id
  }
})
