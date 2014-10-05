var trackApp = angular.module('trackApp', ['ngResource']);

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

trackApp.factory("Destination", function($resource) {
    return $resource("http://sincere-passage-709.appspot.com/cargos/:id/change_destination", null, {
	'change': {method: 'POST', params: {id: "@id", destination: "@destination"}}
    });
});

trackApp.factory("AssignToRoute", function($resource) {
    return $resource("http://sincere-passage-709.appspot.com/cargos/:id/assign_to_route", null, {
	'assign': {method: 'POST', params: {id: "@id"}}
    });
});

trackApp.factory("RouteCandidates", function($resource) {
    return $resource("http://sincere-passage-709.appspot.com/cargos/:id/request_routes", null, {
	'request': {method: 'GET', isArray: true, params: {id: "@id"}}
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

trackApp.controller('BookCargoCtrl', function ($scope, $window, Location, Cargo) {
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

	    // TODO: Close dialog instead of refreshing page.
	    $window.location.href = 'list.html';
	})
    }
});

trackApp.controller('CargoDetailsCtrl', function ($scope, $location, Location, Cargo, Destination) {
    var trackingId = $location.search().trackingId;
    Cargo.find({ id: trackingId }, function(data) {
	$scope.cargo = data;
    });

    Location.query(function(data) {
	$scope.locations = data;
	$scope.selectedDestination = $scope.locations[0].locode
    });

    $scope.changeDestination = function () {
	Destination.change({id: trackingId, destination: $scope.selectedDestination}, function (data) {
	});
    }

    $scope.selectDestination = function (locode) {
	$scope.selectedDestination = locode;
    }
});

trackApp.controller('SelectItineraryCtrl', function ($scope, $location, $window, Cargo, RouteCandidates, AssignToRoute) {
    var trackingId = $location.search().trackingId;
    Cargo.find({ id: trackingId }, function(data) {
	$scope.cargo = data;
    });

    RouteCandidates.request({ id: trackingId }, function (data) {
	$scope.routeCandidates = data;
    });

    $scope.assignToRoute = function (itinerary) {
	AssignToRoute.assign({ id: trackingId }, itinerary, function (data) {
	    $window.location.href = 'details.html#/?trackingId=' + trackingId;
	});
    }
});
