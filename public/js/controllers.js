'use strict';

var app = angular.module('auctionApp');

app.controller('mainCtrl', function($scope, User, $state, $sessionStorage) {
  console.log('mainCtrl');
  $scope.isLoggedIn = !!$sessionStorage.currentUser;
  $scope.$watch(function() {
    return $sessionStorage.currentUser;
  }, function(newVal, oldVal) {
    $scope.isLoggedIn = !!newVal;
  });

  $scope.logOut = () => {
    User.logout()
      .then(res => {
        console.log(res);
        $sessionStorage.currentUser = null;
        $state.go('home');
      });
  }
});

app.controller('homeCtrl', function($scope, User, $state) {
  console.log('homeCtrl');
});

app.controller('newAuctionCtrl', function($scope, User, Auction, $state, $timeout) {
  console.log('newAuctionCtrl');
  $scope.currentDate = new Date();
  $scope.newAuction = {};
  $scope.success = false;
  $scope.startAuction = () => {
    if($scope.newAuction.imgUrl === undefined) $scope.newAuction.imgUrl = "http://placehold.it/200x150";
    $scope.success = true;
    Auction.createOne($scope.newAuction)
      .then((res) => {
        $state.go('auctions');
      })
  }
});

app.controller('auctionCtrl', function($scope, User, $state, Auction, $stateParams, $sessionStorage, $interval) {
  console.log('auctionCtrl');
  $scope.auction = {};
  $scope.isMyAuction = false;
  $scope.newBid = {};
  $scope.currentDate = moment();
  $scope.toEnd = null;
  $interval(function() {
    $scope.currentDate = moment();
    if($scope.auction.endTime) {
      $scope.toEnd = $scope.currentDate.to($scope.auction.endTime);
    }
  }, 1000);
  Auction.getOne($stateParams.id)
    .then((res) => {
      $scope.auction = res.data
      $scope.auction.endTime = moment($scope.auction.endTime);
      $scope.newBid = {};
      if(res.data.createdBy._id === $sessionStorage.currentUser)
        $scope.isMyAuction = true;
    })
  $scope.addBid = () => {
    var value = $scope.newBid.value;
    var id = $scope.auction._id;
    Auction.addBid(id, value)
      .then((res) => {
        Auction.getOne($stateParams.id)
          .then((res) => {
            $scope.auction = res.data
            $scope.auction.endTime = moment($scope.auction.endTime);
            $scope.newBid = {};
            if(res.data.createdBy === $sessionStorage.currentUser)
              $scope.isMyAuction = true;
          })
      })
  }
});

app.controller('auctionsCtrl', function($scope, User, $state, Auction, $interval) {
  console.log('auctionsCtrl');
  $scope.openAuction = (auctionId) => {
    $state.go('auction', {id: auctionId});
  }
  $scope.auctions = [];
  Auction.getAll()
    .then((res) => {
      $scope.auctions = res.data;
    })
  $scope.newAuction = () => {
    $state.go('newAuction');
  }
});

app.controller('registrationCtrl', function($scope, User, $state, $timeout) {
  console.log('registrationCtrl');
  $scope.registration = {};
  $scope.success = false;
  $scope.passwordsNotMatch = false;
  $scope.register = () => {
    if($scope.registration.password1 !== $scope.registration.password2) return $scope.passwordsNotMatch = true;
    var newUser = {
      email: $scope.registration.email,
      password: $scope.registration.password1
    }
    $scope.success = true;
    User.signup(newUser)
      .then((res) => {
          $state.go('login')
      })
  }
});


app.controller('loginCtrl', function($scope, User, $state, $sessionStorage) {
  console.log('loginCtrl');
  $scope.credentials = {};
  $scope.login = () => {
    User.login($scope.credentials)
          .then(() => {
            $state.go('profile')
          });
  }
});

app.controller('profileCtrl', function($scope, User, $state, $sessionStorage, $stateParams) {
  console.log('profileCtrl');
  $scope.profile = {};
  $scope.openAuction = (auctionId) => {
    $state.go('auction', {id: auctionId});
  }
  User.loadprofile()
    .then((res) => {
      $scope.profile = res.data;
    });
});
