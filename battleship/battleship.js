PlayersList = new Mongo.Collection('players'); 
BoardData = new Mongo.Collection('board');
PlayerAction = new Mongo.Collection('actions');
CellArray = new Mongo.Collection('cells');

if (Meteor.isClient) {
  Template.game.onRendered( function(){
    Meteor.call('initCellArray');

    //session var to track state of rotation
    //changed by clicking 'rotate' button
    //starts at "down"
    Session.set('rotation',"down");
  });

//Testing the Testing Framework :) ->Works!
// AddTwo = function AddTwo(num){
//   return num +2;
// }


  //Game will most likely be more on the client side (fast) 
    //Then information will be updated through the server

  Template.game.helpers({
    'cell': function(){
      return CellArray.find();
    },
    'mouseover': function(){
      var cellId = this._id;
      var hoverCell = Session.get('hoverCell');
      if(cellId == hoverCell) return 'mouseHover';
    }
  });

  Template.game.events({
    'click .resetGrid': function() {
      Meteor.call('initCellArray');
    },
    'click .cell': function() {
      var cellId = this._id;
      var selectedCell = Session.set('selectedCell', cellId);

      console.log("You clicked a cell");
    },
    'click .rotate': function(){
      //rotation happens clockwise, starting at down
      var state = Session.get('rotation');

      if(state == "down") Session.set('rotation','left');
      else if(state == "left") Session.set('rotation','up');
      else if(state == "up") Session.set('rotation','right');
      else if(state == "right") Session.set('rotation','down');
      else Session.set('rotation','down');
    },
    'mouseenter .cell': function() {
      var cellId = this._id;
      Session.set('hoverCell',cellId);
    }


  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {

  });
}

Meteor.methods({
  //initGrid
  //takes no parameters
  //populates the gridContainers with elements for each cell
  'initGrid': function(){
    // TODO:
    // link images for the blank grid, ships, hits, misses, and sunk ships to the elements
    var currentUserId = Meteor.userId();

    while(BoardData.findOne({ ownedBy: currentUserId })) {
      BoardData.remove({ ownedBy: currentUserId })
    }

    for(var i = 0; i < 10; i++){
      for(var j = 0; j < 10; j++){
        BoardData.insert({
          x: i,
          y: j,
          ownedBy: currentUserId,
          state: "empty"
        });
      }
    }
    return "finished init";
  },

  //posX is the X position of the cell
  //posY is the Y position of the cell
  //rotation is in directions "up","left","down","right" from the clicked location
  'placeShip': function(posX, posY, rotation){
    // var currentUserId = Meteor.userId();



  },


  //posX is the X position of the cell
  //posY is the Y position of the cell
  //rotation is in directions "up","left","down","right" from the clicked location
  //ship is a string: "carrier","battleship","cruiser","submarine","destroyer"
  'checkShipPosition': function(posX,posY,rotation,ship){
    var ships = {"carrier":5,"battleship":4,"cruiser":3,"submarine":3,"sub":3,"destroyer":2};

    if(rotation == "up"){
      if(posY - ships.ship < 0){
        return "invalid position";
      } else {
        return "valid position";
      };
    } else if (rotation == "left"){
      if(posX - ships.ship < 0){
        return "invalid position";
      } else {
        return "valid position";
      }
    } else if (rotation == "down"){
      if(posY + ships.ship > 9){
        return "invalid position";
      } else {
        return "valid position";
      }
    } else if (rotation == "right"){
      if(posX + ships.ship > 9){
        return "invalid position";
      } else {
        return "valid position";
      }
    } else {
      return "invalid position";
    }
  },

  'initCellArray': function(){
    CellArray.remove({});

    for(var i = 0; i < 10; i++){
      for(var j = 0; j < 10; j++){
        CellArray.insert({
          x: i,
          y: j,
          state: "empty"
        });
      }
    }
  }


});