'use strict';

var app = angular.module('auctionApp', ['ui.router', 'ui.bootstrap', 'angularSpinner', 'ngStorage']);

app.config(function($stateProvider, $urlRouterProvider){
  $stateProvider
    .state('home', {
      url:'/',
      templateUrl: '/html/home.html',
      controller: 'homeCtrl'
    })
    .state('login', {
      url:'/login',
      templateUrl: '/html/login.html',
      controller: 'loginCtrl'
    })
    .state('profile', {
      url:'/profile',
      templateUrl: '/html/profile.html',
      controller: 'profileCtrl'
    })

  $urlRouterProvider.otherwise('/');
});
