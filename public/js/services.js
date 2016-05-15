'use strict';

var app = angular.module('auctionApp');

app.service('User', function($http, $sessionStorage, $q) {

  this.signup = (newUserObj) => {
    return $http.post('./api/users/register', newUserObj);
  }

  this.login = (loginDetailsObj) => {
    return $http.post('./api/users/login', loginDetailsObj)
                .then((res) => {
                  $sessionStorage.currentUser = res.data;
                });
  }
  this.logout = () => {
    return $http.delete('./api/users/logout');
  }

  this.loadprofile = () => {
    return $http.get('./api/users/profile');
  }

  this.editprofile = (editedUserObj) => {
    return $http.put('./api/users/profile', editedUserObj);
  }

  this.getPeople = () => {
    return $http.get('./api/users/people');
  }

  this.getPerson = (id) => {
    return $http.get('./api/users/people/' + id);
  }

})

app.service('Auction', function($http, $sessionStorage, $q) {
  this.getAll = () => {
    return $http.get('./api/auctions');
  }
  this.getOne = (id) => {
    return $http.get(`./api/auctions/${id}`);
  }
  this.addBid = (id, value) => {
    return $http.post(`./api/auctions/${id}/addBid/`, {"value": value});
  }
  this.createOne = (auctionObj) => {
    return $http.post('./api/auctions', auctionObj);
  }
})

app.service('StoreData', function() {
  var storeData = {};
  this.get = () => { return storeData }
  this.set = (data) => { storeData = data }
})
