var app = angular.module("app");

app.controller('TrackCtrl', function ($scope, BookingService) {
    $scope.showCargo = function (trackingId) {
	$scope.cargo = BookingService.getCargo(trackingId);
    }
});

app.controller('ListCargoCtrl', function ($scope, cargos) {
    $scope.cargos = cargos;
});

app.controller('BookCargoCtrl', function ($scope, $location, Location, BookingService) {
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
	$scope.bookedCargo = BookingService.bookCargo($scope.selectedOrigin, $scope.selectedDestination, deadlineDate);

	// refresh list
	$scope.$parent.cargos = BookingService.getCargos();
    }
});

app.controller('CargoDetailsCtrl', function ($scope, $location, Location, BookingService) {
    var trackingId = $location.search().trackingId;
    $scope.cargo = BookingService.getCargo(trackingId);

    Location.query(function(data) {
	$scope.locations = data;
	$scope.selectedDestination = $scope.locations[0].locode
    });

    $scope.changeDestination = function () {
	BookingService.changeDestination(trackingId, $scope.selectedDestination);
    }

    $scope.selectDestination = function (locode) {
	$scope.selectedDestination = locode;
    }
});

app.controller('SelectItineraryCtrl', function ($scope, $location, BookingService) {
    var trackingId = $location.search().trackingId;
    $scope.cargo = BookingService.getCargo(trackingId);
    $scope.routeCandidates = BookingService.requestPossibleRoutes(trackingId);

    $scope.assignToRoute = function (itinerary) {
	BookingService.assignToRoute(trackingId, itinerary);
	$location.path('/details').search('trackingId', trackingId);
    }
});
