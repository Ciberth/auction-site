'use strict';

var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
var moment = require('moment');
var bcrypt = require('bcryptjs');

require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;

if(!JWT_SECRET) {
  throw new Error('Missing JWT_SECRET');
}

var auctionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  imgUrl: { type: String, required: true },
  endTime: { type: String, required: true },
  bids: [{
    madeBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
    value: { type: Number, required: true },
    date: { type: String, required: true }
  }]
});

auctionSchema.statics.createNew = (auctionObj, userId, cb) => {
  if(!auctionObj) res.send('Not proper auction format!');

  var auction = new Auction({
    title: auctionObj.title,
    description: auctionObj.description,
    imgUrl: auctionObj.imgUrl,
    endTime: auctionObj.endTime,
    bids: [{
      madeBy: userId,
      value: auctionObj.initialPrice,
      date: moment()
    }]
  });
  console.log('cb1:',cb);
  auction.save((err1, auction) => {
    console.log('cb2:',cb);
    User.findById(userId, (err2, user) => {
      console.log('cb3:',cb);
      user.addAuction(auction.id);
      cb(err1 || err2);
    })
  });
}

auctionSchema.statics.editOne = (userId, auctionId, editedAuction, cb) => {
  Auction.findById(auctionId, (err, oldAuction) => {
    if(err) cb(err);
    if(oldAuction.bids[0].madeBy.toString() !== userId.toString()) return cb({err: 'You aren\'t the creator of this auction. Not authorized to edit.'})
    var auction = {
      title: editedAuction.title,
      description: editedAuction.description,
      imgUrl: editedAuction.imgUrl,
      endTime: editedAuction.endTime
    };
    var onlyEdited = {};
    for(var key in auction) {
      if(auction[key] !== undefined && auction[key] !== null) onlyEdited[key] = auction[key];
    }
    Auction.findByIdAndUpdate(auctionId, { $set: onlyEdited }, {new: true}, cb);
  })
}

auctionSchema.methods.addBid = function (userId, value, cb) {
  if(this.bids[this.bids.length - 1].value >= value) return cb({err: 'Your bid must be higher then the highest bid!'});
  var bid = {
    "madeBy": userId,
    "value": value,
    "date": moment()
  }
  console.log(bid);
  this.bids.push(bid);
  this.save(cb);
}

auctionSchema.methods.removeBid = function (bidId, userId, cb) {
  var firstBidId = this.bids[0]._id.toString();
  if(firstBidId === bidId.toString()) return cb({err: 'This is the initial bid. You can\'t delete it'})
  var bidCreatorId = this.bids.filter((bid) => {
    return bid._id.toString() === bidId.toString();
  })[0].madeBy;
  if(bidCreatorId.toString() !== userId.toString()) return cb({err: 'You aren\'t the creator of this bid. Not authorized to delete.'})
  this.bids = this.bids.filter((bid) => {
    return bid._id.toString() !== bidId.toString();
  })
  this.save(cb);
}


var Auction = mongoose.model('Auction', auctionSchema);
var User = require('../models/user');

module.exports = Auction;
