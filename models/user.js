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

var Auction = require('../models/auction');

var userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  auctions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Auction' }]
});

// IT'S MIDDLEWARE!!
userSchema.statics.isLoggedIn = function(req, res, next) {
  var token = req.cookies.accessToken;

  jwt.verify(token, JWT_SECRET, (err, payload) => {
    if(err) return res.status(401).send({error: 'Must be authenticated.'});

    User
      .findById(payload._id)
      .select({password: false})
      .populate('auctions')
      .exec((err, user) => {
        if(err || !user) {
          return res.clearCookie('accessToken').status(400).send(err || {error: 'User not found.'});
        }
        req.user = user;
        next();
      })
  });
};

userSchema.statics.register = function(userObj, cb) {
  User.findOne({email: userObj.email}, (err, dbUser) => {
    if(err || dbUser) return cb(err || { error: 'Username not available.' })

    bcrypt.hash(userObj.password, 12, (err, hash) => {
      if(err) return cb(err);

      var user = new User({
        email: userObj.email,
        password: hash
      })

      user.save(cb)
    })
  })
};

userSchema.statics.editProfile = function(userId, newUser, cb) {
  User.findByIdAndUpdate(userId, { $set: newUser }, {new: true}, cb);
};

userSchema.statics.authenticate = function(userObj, cb) {
  // find the user by the email
  // confirm the password
  // if user is found, and password is good, create a token
  this.findOne({email: userObj.email}, (err, dbUser) => {
    if(err || !dbUser) return cb(err || { error: 'Login failed. Username or password incorrect.' });

    bcrypt.compare(userObj.password, dbUser.password, (err, isGood) => {
      if(err || !isGood) return cb(err || { error: 'Login failed. Username or password incorrect.' });

      var token = dbUser.makeToken();

      cb(null, token, dbUser._id);
    })
  });
};

userSchema.methods.makeToken = function() {
  var token = jwt.sign({
    _id: this._id,
    exp: moment().add(1, 'day').unix() // in seconds
   }, JWT_SECRET);
  return token;
};

userSchema.methods.addAuction = function(auctionObj, cb) {
  this.auctions.push(auctionObj);
  this.save(cb);
};

userSchema.methods.removeAuction = function(auctionId, cb) {
  var index = this.auctions.indexOf(auctionId.toString());
  console.log('index:', index);
  this.auctions.splice(index, 1);
  this.save(cb);
};

var User = mongoose.model('User', userSchema);

module.exports = User;
