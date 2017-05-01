var app = angular
    .module('app', ['ngRoute', 'ngResource', 'ngCookies', 'ui.bootstrap'])
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/', {
            templateUrl: 'views/about.html',
        }).when('/track', {
            templateUrl: 'views/track.html',
            controller: 'TrackCtrl'
        }).when('/list', {
            templateUrl: 'views/list.html',
            controller: 'ListCtrl',
        }).when('/details', {
            templateUrl: 'views/details.html',
            controller: 'DetailsCtrl'
        }).when('/selectItinerary', {
            templateUrl: 'views/selectItinerary.html',
            controller: 'SelectItineraryCtrl'
        }).when('/log', {
            templateUrl: 'views/log.html',
            controller: 'IncidentLoggingCtrl'
        }).when('/documentation', {
            templateUrl: 'views/documentation.html'
        });
    }]);
