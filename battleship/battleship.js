PlayersList = new Mongo.Collection('players'); 

if (Meteor.isClient) {
  //Game will most likely be more on the client side (fast) 
    //Then information will be updated through the server

  Template.battleship.helpers({
    
  });

  Template.battleship.events({
    
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
