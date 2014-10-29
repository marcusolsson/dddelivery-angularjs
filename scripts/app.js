var app = angular
    .module('app', ['ngRoute', 'ngResource', 'ui.bootstrap'])
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.
        when('/', {
            templateUrl: 'views/about.html',
        }).
        when('/track', {
            templateUrl: 'views/track.html',
            controller: 'TrackCtrl'
        }).
        when('/list', {
            templateUrl: 'views/list.html',
            controller: 'ListCtrl',
            resolve: {
                cargos: function(BookingService) {
                    return BookingService.getCargos();
                }
            }
        }).
        when('/details', {
            templateUrl: 'views/details.html',
            controller: 'DetailsCtrl'
        }).
        when('/selectItinerary', {
            templateUrl: 'views/selectItinerary.html',
            controller: 'SelectItineraryCtrl'
        });
    }]);
