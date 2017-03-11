//server methods for creating / inserting feeds as well as running feeds (ie getting the data)
//TODO feeds.js needs a massive refactor, it is kind of a mess.  it's working, but its just so ugly
//TODO server needs to continously collect all user feeds.  maybe use a worker library to manage rate limits and retry later if exceeded
//TODO store and use user credentials to connect to twitter, google, etc
//TODO make geo / nogeo feed results behave better (ie if a nogeo post contains geodata make it geo and vice-versa)
//FIXME catch errors from google geocoder, if it can't find a location, post should be turned into nogeo
//TODO switch from nlp compromise to Spacy NLP to (hopefully) improve entity recognition
//TODO implement all enhancements made for twitter feeds on RSS feeds as well (NLP, geocoding, etc)
//TODO parse out and display twitter entities on post details page
//TODO check all data before inserting into collections


//initialize geocoder just using google for default for now TODO use OSM / Mapquest for geocoder provider after google rate limit is reached move this function to top of feeds.js
// AIzaSyBA3dFwtiLtM3H-F9Kkl_F7ez52ubPXE8I

import nlp from 'compromise'

//function to turn twitter date string into a real date
function parseTwitterDate(text) {
return new Date(Date.parse(text.replace(/( +)/, ' UTC$1')));
}

//function using NLP compromise to parse out locations from text and stick them in an array
function getLocations(text) {
  var r = nlp(text)
  var places = r.places()
  places.sort('alpha')
  console.log (places.out('array'))
  return places.out('array')
}

//same thing but for people
function getPeople(text) {
  var r = nlp(text)
  var people = r.people()
  people.sort('alpha')
  console.log (people.out('array'))
  return people.out('array')
}

//and organizations
function getOrgs(text) {
  var r = nlp(text)
  var orgs = r.organizations()
  orgs.sort('alpha')
  console.log (orgs.out('array'))
  return orgs.out('array')
}

//and nouns in general, why not!
function getNouns(text) {
  var r = nlp(text)
  var nouns = r.nouns()
  nouns.sort('alpha')
  console.log (nouns.out('array'))
  return nouns.out('array')
}

Meteor.methods({
  'insertFeedData': function(feed, isLocationBased) {
    var currentUserId = Meteor.userId();
    feedsList.insert({
      name: feed.feedNameVar,
      type: feed.feedTypeVar,
      query: feed.feedQueryVar,
      location: feed.feedLocationVar,
      latitude: feed.feedLatitudeVar,
      longitude: feed.feedLongitudeVar,
      radius: feed.feedRadiusVar,
      geo: isLocationBased,
      score: 0,
      createdBy: currentUserId
    });
    console.log (isLocationBased);
  },
  'removeFeedData': function(selectedFeed) {
    feedsList.remove(selectedFeed);
  },
  'modifyFeedScore': function(selectedFeed, scoreValue) {
    feedsList.update(selectedFeed, {$inc: {score: scoreValue}});
  },
  'addVerificationData': function(verificationData) {
//add verification data to post
    Posts.update (verificationData.postId, {$set: {
      verified : true,
      verificationScore : verificationData.verificationScore,
      verificationSteps : verificationData.verificationSteps
    }});
    //find source of post and insert post score object into verified posts array
    var owningSource = Sources.find({ $and: [{author: verificationData.verifiedPostAuthor}, {type: verificationData.verifiedPostType}]}).fetch();
    console.log("============================")
    console.log(owningSource[0]._id)
    console.log(verificationData.verificationScore)
    console.log("============================")

    Sources.update (owningSource[0]._id, { $push: {"levelOfConfidence.verifiedPosts": {postID: verificationData.postId, verificationScore: verificationData.verificationScore}}})

//calculate new level of confidence for source and update loc value
var verifiedPostsTotal = 0;
//get updated source info
owningSource = Sources.find({ $and: [{author: verificationData.verifiedPostAuthor}, {type: verificationData.verifiedPostType}]}).fetch();
console.log ('source verified posts total: ' + owningSource[0].levelOfConfidence.verifiedPosts.length)
console.log ('adding verification scores');
for (i = 0; i < owningSource[0].levelOfConfidence.verifiedPosts.length; i++) {

  console.log (owningSource[0].levelOfConfidence.verifiedPosts[i].verificationScore)
  verifiedPostsTotal = verifiedPostsTotal + owningSource[0].levelOfConfidence.verifiedPosts[i].verificationScore;

}

var newVerifiedPostsTotal = verifiedPostsTotal
var newLocValue = newVerifiedPostsTotal / (owningSource[0].levelOfConfidence.verifiedPosts.length)
console.log('------')
console.log('total: ' + newVerifiedPostsTotal);
console.log('loc is ' + newLocValue);
Sources.update (owningSource[0]._id, {$set: {"levelOfConfidence.locValue": newLocValue}});


  },

  'twitterQuery': function(selectedFeed) {

    // get parameters for twitter query from the selected feed

    var q = feedsList.find({_id: selectedFeed}, {fields: {query: 1}}).fetch();
    var user = feedsList.find({_id: selectedFeed}, {fields: {createdBy: 1}}).fetch();
    var geo = feedsList.find({_id: selectedFeed}, {fields: {geo: 1}}).fetch();
    var latitude = feedsList.find({_id: selectedFeed}, {fields: {latitude: 1}}).fetch();
    var longitude = feedsList.find({_id: selectedFeed}, {fields: {longitude: 1}}).fetch();
    var radius = feedsList.find({_id: selectedFeed}, {fields: {radius: 1}}).fetch();
    var geo = feedsList.find({_id: selectedFeed}, {fields: {_id: 0, geo: 1}}).fetch();
    console.log (geo[0])
    var Twit = new TwitMaker({
      consumer_key: '4CFoAMFMkyK61CPoSpyn2w',
      consumer_secret: 'A1el7aBn6tMpf06ZECaojVPwTiddL8mbOJLi6lO66dM',
      access_token: '714884695-945ANy8EjMMbhsED3PsjXoZwIXyGu5B2UbKpKZ3Q',
      access_token_secret: 'x27LT75sRz6Fg8L1vtSWRg9uEQj53omTZAGbAJb4ZI'
});

    //make sure to wrap that stupid bastard in Meteor.bindEnvironment!!! I don't know why, but has something to do with inserting data originating from certain packages, in this case the twit npm package... ugh.. blaaaaa!

   //if the feed is not location based make twitter request using 'q' parameter only

  if (geo[0].geo === false) {
   Twit.get('search/tweets', {q: q[0].query, count: 100}, Meteor.bindEnvironment(function(error, tweets, response){

   console.log('no geo');

   //loop through each tweet and parse out the info we want

   for (i = 0; i < tweets.statuses.length; i++) {

     var dupCheck = Posts.find({tweetID: tweets.statuses[i].id_str}).count();
     if (dupCheck === 0) {
     console.log (JSON.stringify(dupCheck, null, 2));

     console.log(tweets.statuses[i].id_str);

     var twitterPost = {
      userId: user,
      author: tweets.statuses[i].user.screen_name,
      submitted: new Date(),
      created: parseTwitterDate(tweets.statuses[i].created_at),
      commentsCount: 0,
      upvoters: [],
      votes: 0,
      title: tweets.statuses[i].text.substring (0, 50) + "...",
      url: 'https://www.twitter.com/'+tweets.statuses[i].user.screen_name+'/status/'+tweets.statuses[i].id_str,
      body: tweets.statuses[i].text,
      tweetID: tweets.statuses[i].id_str,
      tags: {
        places: getLocations(tweets.statuses[i].text),
        people: getPeople(tweets.statuses[i].text),
        orgs: getOrgs(tweets.statuses[i].text),
        nouns: getNouns(tweets.statuses[i].text)
      },
      image: tweets.statuses[i].user.profile_image_url
     }

     console.log (twitterPost);

     //insert twitter data into the posts collection

     var owner = Meteor.user();

     Posts.insert({
      userId: owner._id,
      author: twitterPost.author,
      submitted: new Date(),
      created: twitterPost.created,
      commentsCount: 0,
      upvoters: [],
      votes: 0,
      title: twitterPost.title,
      url: twitterPost.url,
      body: twitterPost.body,
      tweetID: twitterPost.tweetID,
      tags: twitterPost.tags,
      type: 'twitter',
      geo: false,
      image: twitterPost.image
     });
     console.log('inserting tweet in DB');
}

     else {
       console.log ('tweet already exists in DB, skipping');
       console.log ('-------------------------------');
     }
  }
    })
    )
  }

  // if the feed was location based then make a twitter request using the optioal 'geocode' parameters as well

  else {

  console.log ('geo')
  console.log (geo)
  console.log (latitude);
  console.log (longitude);
  console.log (radius);

  Twit.get('search/tweets', {q: q[0].query, geocode: latitude[0].latitude + ',' + longitude[0].longitude + ',' + radius[0].radius / 1000 + 'km', count: 50}, Meteor.bindEnvironment(function(error, tweets, response){

   //loop through each tweet and parse out the info we want -- same as above for non-geo feeds
   //console.log (tweets.statuses[0])

   for (i = 0; i < tweets.statuses.length; i++) {

     var dupCheck = Posts.find({tweetID: tweets.statuses[i].id_str}).count();
     if (dupCheck === 0) {
     console.log (JSON.stringify(dupCheck, null, 2));

     console.log(tweets.statuses[i].id_str);

      //console.log(tweets.statuses[0].geo.coordinates[0]);
      //console.log(tweets.statuses[0].geo.coordinates[1]);

     //extract entities from twitter text, loop through them and push into tags array

    //  var entity = nlp.spot(tweets.statuses[i].text);
     var tags = [];
     //
    //  //console.log('tags: ' + entity.length);
    //  for (t = 0; t < entity.length; t++) {
    //    tags.push (entity[t].text);
     //
    //  }

     //console.log (tags);
     //console.log(JSON.stringify(tweets.statuses[i], null, 2));

//check if tweet has geodata, if not do lookup on twitter place name or profile location

     if (tweets.statuses[i].coordinates === null) {

       var geo = new GeoCoder({
         geocoderProvider: "google",
         httpAdapter: "https",
         apiKey: 'AIzaSyBA3dFwtiLtM3H-F9Kkl_F7ez52ubPXE8I'
       });

       var place = '';
       var userLocation = '';
       var geolocationType = '';

       console.log('coordinates null for tweet' + i);

       console.log(tweets.statuses[i].text);
            if (tweets.statuses[i].place !== null) {
              place = tweets.statuses[i].place.full_name;
              userLocation = tweets.statuses[i].place.full_name;
              geolocationType = 'place';
          }

          else {
            place = tweets.statuses[i].user.location;
            userLocation = tweets.statuses[i].user.location;
            geolocationType = 'profile';
          }

          var locCheck = locationCache.find({locationName: place}).fetch();

          //check the location cache for the place name, if not found use google geocoder
          if (locCheck[0] === undefined) {
            console.log('location not found in cache, asking google')
            var placeLatLon = geo.geocode(place);
            console.log('getting location for ' + userLocation);
            var coordinates = [placeLatLon[0].latitude, placeLatLon[0].longitude];
            console.log ('got location of ' + coordinates[0] + ' ' + coordinates[1]);
            //add new data from google to cache
            locationCache.insert({
              locationName: place,
              latitude: coordinates[0],
              longitude: coordinates[1],
              type: 'google'
            });
            console.log('wrote location to cache');
          }

          else {

            console.log('found ' + locCheck[0].locationName + ' in location cache');
            var coordinates = [locCheck[0].latitude, locCheck[0].longitude];
            console.log (coordinates[0]);
            console.log (coordinates[1]);
            }

            twitterPost = {
             userId: user,
             author: tweets.statuses[i].user.screen_name,
             submitted: new Date(),
             created: parseTwitterDate(tweets.statuses[i].created_at),
             commentsCount: 0,
             upvoters: [],
             votes: 0,
             title: tweets.statuses[i].text.substring (0, 50) + "...",
             url: 'https://www.twitter.com/'+tweets.statuses[i].user.screen_name+'/status/'+tweets.statuses[i].id_str,
             body: tweets.statuses[i].text,
             tweetID: tweets.statuses[i].id_str,
             tags: {
               places: getLocations(tweets.statuses[i].text),
               people: getPeople(tweets.statuses[i].text),
               orgs: getOrgs(tweets.statuses[i].text),
               nouns: getNouns(tweets.statuses[i].text)
             },
             location: userLocation,
             latitude: coordinates[0],
             longitude: coordinates[1],
             //latitude: profileLocation[0],
             //longitude: profileLocation[1],
             image: tweets.statuses[i].user.profile_image_url,
             geolocationType: geolocationType
           }
}
    else {

  geolocationType = 'device';

     twitterPost = {
      userId: user,
      author: tweets.statuses[i].user.screen_name,
      submitted: new Date(),
      created: parseTwitterDate(tweets.statuses[i].created_at),
      commentsCount: 0,
      upvoters: [],
      votes: 0,
      title: tweets.statuses[i].text.substring (0, 50) + "...",
      url: 'https://www.twitter.com/'+tweets.statuses[i].user.screen_name+'/status/'+tweets.statuses[i].id_str,
      body: tweets.statuses[i].text,
      tweetID: tweets.statuses[i].id_str,
      tags: {
        places: getLocations(tweets.statuses[i].text),
        people: getPeople(tweets.statuses[i].text),
        orgs: getOrgs(tweets.statuses[i].text),
        nouns: getNouns(tweets.statuses[i].text)
      },
      location: tweets.statuses[i].place.full_name,
      latitude: tweets.statuses[i].geo.coordinates[0],
      longitude: tweets.statuses[i].geo.coordinates[1],
      image: tweets.statuses[i].user.profile_image_url,
      geolocationType: geolocationType
     }
   }
     //console.log (tweets.statuses[i].place.full_name);
     //console.log (twitterPost);

     //insert twitter data into the posts collection
     //TODO do a duplicate check before inserting twitterPost into posts collection

//console.log(twitterPost);

     var owner = Meteor.user();

     Posts.insert({
      userId: owner._id,
      author: twitterPost.author,
      submitted: new Date(),
      created: twitterPost.created,
      commentsCount: 0,
      upvoters: [],
      votes: 0,
      title: twitterPost.title,
      url: twitterPost.url,
      body: twitterPost.body,
      tweetID: twitterPost.tweetID,
      tags: twitterPost.tags,
      type: 'twitter',
      location: twitterPost.location,
      latitude: twitterPost.latitude,
      longitude: twitterPost.longitude,
      image: twitterPost.image,
      geo: true,
      geolocationType: twitterPost.geolocationType
     });

     console.log('inserted post for tweet ' + i);

//insert source data into sources collection
var currentUserId = Meteor.userId();
var postAuthor = Sources.find({author: twitterPost.author}).fetch();
   console.log(postAuthor);
   var sourcePostCount = postAuthor.sourcePostCount;
   //console.log(sourcePostCount);
   if (postAuthor.count() !== 0) {


     console.log ('current source post count is ' + postAuthor[0].sourcePostCount);

     var newPostCount = postAuthor[0].sourcePostCount + 1;
     Sources.update(postAuthor[0]._id, {$set: {sourcePostCount: newPostCount}});

     console.log ('post count by this source has been updated to ' + newPostCount);
   }
   else {
     Sources.insert({
       author: twitterPost.author,
       type: 'twitter',
       image: twitterPost.image,
       sourcePostCount: 1,
       lastPost: twitterPost.submitted,
       createdBy: currentUserId,
       levelOfConfidence: {locValue: 0, verifiedPosts: []}
     })
     console.log ('new source created');
     newSource = Sources.find({author: twitterPost.author})
     //console.log (newSource);
   }

     console.log('------------------------')
}

else {
console.log ('document already in DB, skipping');
console.log ('--------------------------');


}
    }
    })
    )
}
  },

  'RSSQuery': function(selectedFeed) {

    var owner = Meteor.user();
    var q = feedsList.find({_id: selectedFeed}, {fields: {query: 1}}).fetch();
    var user = feedsList.find({_id: selectedFeed}, {fields: {createdBy: 1}}).fetch();
    console.log (q[0].query);
    console.log (user[0].createdBy);

    //use anonyfox:scrape package to scrape RSS feed

    var feedURL = q[0].query;
    var feedData = Scrape.feed (q[0].query);
    //console.log (feedData);
    console.log  (feedData.items.length);

    //loop through the returned feed object and get stuff out that we want

    for (i = 0; i < feedData.items.length; i++) {

      var dupCheck = Posts.find({url: feedData.items[i].link}).count();
      console.log(dupCheck);
      if (dupCheck === 0) {

      //console.log (feedData.items[i].tags);
      var newsPost = {
      userId: user,
      author: feedData.title,
      submitted: new Date(),
      created: new Date(),
      commentsCount: 0,
      upvoters: [],
      votes: 0,
      title: feedData.items[i].title.substring (0, 50) + "...",
      url: feedData.items[i].link,
      body: feedData.items[i].description,
      tags: feedData.items[i].tags,
      image: feedData.items[i].image

     }

      //insert into posts collection

      Posts.insert({
      userId: owner._id,
      author: newsPost.author,
      submitted: new Date(),
      created: newsPost.created,
      commentsCount: 0,
      upvoters: [],
      votes: 0,
      title: newsPost.title,
      url: newsPost.url,
      body: newsPost.body,
      tags: newsPost.tags,
      type: 'RSS',
      image: newsPost.image,

      geo: false
     });
     console.log ('feed item inserted in DB');
    }

  else {
    console.log ('feed item already in DB, skipping');
  }
}
  }
})
