var app = angular
    .module('app', ['ngRoute', 'ngResource'])
    .config(['$routeProvider', function($routeProvider) {
	$routeProvider.
	    when('/', {
		templateUrl: 'templates/track.html',
		controller: 'TrackCtrl'
	    }).
	    when('/list', {
		templateUrl: 'templates/list.html',
		controller: 'ListCargoCtrl',
		resolve: {
		    cargos: function(BookingService) {
			return BookingService.getCargos();
		    }
		}
	    }).
	    when('/details', {
		templateUrl: 'templates/details.html',
		controller: 'CargoDetailsCtrl'
	    }).
	    when('/selectItinerary', {
		templateUrl: 'templates/selectItinerary.html',
		controller: 'SelectItineraryCtrl'
	    });
    }]);
