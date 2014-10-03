var trackApp = angular.module('trackApp', ['ngResource']);

trackApp.config(function ($locationProvider) {
    $locationProvider.html5Mode(true);
});

trackApp.factory("Location", function($resource) {
    return $resource("http://sincere-passage-709.appspot.com/locations");
});

trackApp.factory("Cargo", function($resource) {
    return $resource("http://sincere-passage-709.appspot.com/cargos/:id", null, {
	'find': {method: 'GET', params: {id: "@id"}},
	'list': {method: 'GET', isArray: true},
	'book': {method: 'POST', params: {origin: "@origin", destination: "@destination", arrivalDeadline: "@arrivalDeadline"}}
    });
});

trackApp.controller('TrackCtrl', function ($scope, Cargo) {
    $scope.showCargo = function (query) {
	if (query) {
	    Cargo.find({ id: query }, function(data) {
		$scope.cargo = data;
	    });
	} else {
	    $scope.cargo = null
	}
    }
});

trackApp.controller('ListCtrl', function ($scope, Cargo) {
    Cargo.list(function(data) {
	$scope.cargos = data;
    });
});

trackApp.controller('BookCargoCtrl', function ($scope, Location, Cargo) {
    Location.query(function(data) {
	$scope.locations = data;
	$scope.selectedOrigin = $scope.locations[0].locode
	$scope.selectedDestination = $scope.locations[0].locode
    });

    $scope.selectOrigin = function (locode) {
	$scope.selectedOrigin = locode;
    }

    $scope.selectDestination = function (locode) {
	$scope.selectedDestination = locode;
    }

    $scope.bookCargo = function () {
	var deadlineDate = new Date($scope.deadline).getTime();

	Cargo.book({
	    origin: $scope.selectedOrigin,
	    destination: $scope.selectedDestination,
	    arrivalDeadline: deadlineDate
	}, function(bookResponse) {
	    $scope.bookedCargo = bookResponse;

	    // refresh list
	    Cargo.list(function(listResponse) {
		$scope.$parent.cargos = listResponse;
	    });
	})
    }
});

trackApp.controller('CargoDetailsCtrl', function ($scope, $location, Cargo) {
    var trackingId = $location.search().trackingId;
    Cargo.find({ id: trackingId }, function(data) {
	$scope.cargo = data;
    });
});
