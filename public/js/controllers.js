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

  $scope.logout = () => {
    Auth.logout()
      .then(res => {
        $state.go('home');
      })
  }

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
  User.loadprofile()
    .then((res) => {
      $scope.profile = res.data;
    });
});
