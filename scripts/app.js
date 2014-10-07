var app = angular
    .module('app', ['ngRoute', 'ngResource', 'ui.bootstrap'])
    .config(['$routeProvider', function($routeProvider) {
	$routeProvider.
	    when('/', {
		templateUrl: 'template/track.html',
		controller: 'TrackCtrl'
	    }).
	    when('/list', {
		templateUrl: 'template/list.html',
		controller: 'ListCargoCtrl',
		resolve: {
		    cargos: function(BookingService) {
			return BookingService.getCargos();
		    }
		}
	    }).
	    when('/details', {
		templateUrl: 'template/details.html',
		controller: 'CargoDetailsCtrl'
	    }).
	    when('/selectItinerary', {
		templateUrl: 'template/selectItinerary.html',
		controller: 'SelectItineraryCtrl'
	    });
    }]);
