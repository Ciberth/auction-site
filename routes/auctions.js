'use strict';

var express = require('express');
var router = express.Router();


var Auction = require('../models/auction');
var User = require('../models/user');

router.get('/', (req, res) => {
  Auction.find({}, (err, auctions) => {
    return err ? res.status(400).send(err) : res.send(auctions);
  });
});

router.post('/', User.isLoggedIn, (req, res) => {
  Auction.createNew(req.body, req.user._id, (err, auction) => {
    res.status(err ? 400 : 200).send(err || auction);
  });
});

router.get('/:id', User.isLoggedIn, (req, res) => {
  Auction.findById(req.params.id, (err, auction) => {
    res.status(err ? 400 : 200).send(err || auction);
  });
});

router.put('/:id', User.isLoggedIn, (req, res) => {
  Auction.editOne(req.user._id, req.params.id, req.body, (err, editedAuction) => {
    res.status(err ? 400 : 200).send(err || editedAuction);
  });
});

router.delete('/:id', User.isLoggedIn, (req, res) => {
  User.findById(req.user._id, (err1, user) => {
    if(err1) return res.status(400).send({err: err});
    user.removeAuction(req.params.id, (err2) => {
      if(err2) return res.status(400).send({err: err});
      Auction.findById(req.params.id, (err, auction) => {
        if(auction && auction.bids[0].madeBy.toString() !== req.user._id.toString()) return res.status(400).send('You aren\'t the creator of this auction. Not authorized to delete.');
        Auction.findByIdAndRemove(req.params.id, (err) => {
          res.status(err ? 400 : 200).send(err || `Document deleted: ${req.params.id}`);
        });
      });
    });
  });
});

router.post('/:id/addBid', User.isLoggedIn, (req, res) => {
  Auction.findById(req.params.id, (err, auction) => {
    if(auction && auction.bids[0].madeBy.toString() === req.user._id.toString()) return res.status(400).send('You can\'t place a bid on your own item.');
    if(err) return res.status(400).send(err);
    auction.addBid(req.user._id, req.body.value, (err) => {
      res.status(err ? 400 : 200).send(err || `Bid added!`);
    })
  })
});

router.delete('/:auctionId/removeBid/:bidId', User.isLoggedIn, (req, res) => {
  Auction.findById(req.params.auctionId, (err, auction) => {
    if(err) return res.status(400).send(err);
    auction.removeBid(req.params.bidId, req.user._id, (err) => {
      res.status(err ? 400 : 200).send(err || `Bid removed!`);
    })
  })
});

module.exports = router;
