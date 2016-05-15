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

app.service('StoreData', function() {
  var storeData = {};
  this.get = () => { return storeData }
  this.set = (data) => { storeData = data }
})
