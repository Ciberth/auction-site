'use strict';

var app = angular.module('auctionApp', ['ui.router', 'ui.bootstrap', 'angularSpinner', 'ngStorage', 'ngRoute']);

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
    .state('registration', {
      url:'/registration',
      templateUrl: '/html/registration.html',
      controller: 'registrationCtrl'
    })
    .state('profile', {
      url:'/profile',
      templateUrl: '/html/profile.html',
      controller: 'profileCtrl'
    })
    .state('auctions', {
      url:'/auctions',
      templateUrl: '/html/auctions.html',
      controller: 'auctionsCtrl'
    })
    .state('auction', {
      url:'/auction/:id',
      templateUrl: '/html/auction.html',
      controller: 'auctionCtrl'
    })
    .state('newAuction', {
      url:'/newAuction/:id',
      templateUrl: '/html/newAuction.html',
      controller: 'newAuctionCtrl'
    })

  $urlRouterProvider.otherwise('/');
});
