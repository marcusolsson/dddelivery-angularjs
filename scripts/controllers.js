var app = angular.module("app");

app.controller('TrackCtrl', function ($scope, BookingService) {
    $scope.showCargo = function (trackingId) {
	$scope.cargo = BookingService.getCargo(trackingId);
    }
});

app.controller('ListCargoCtrl', function ($scope, $modal, $location, cargos) {
    $scope.cargos = cargos;

    // Method to open dialog for booking a cargo.
    $scope.open = function () {
	var modalInstance = $modal.open({
	    templateUrl: 'template/bookCargo.html',
	    controller: 'BookCargoCtrl'
	});

	// Redirect to details page if cargo was booked.
	modalInstance.result.then(function (bookedCargo) {
	    $location.path('/details').search('trackingId', bookedCargo.trackingId);
	});
    };
});

app.controller('BookCargoCtrl', function ($scope, $location, BookingService, $modalInstance) {
    // Populate location dropdowns
    BookingService.getLocations().$promise.then(function(data) {
	$scope.locations = data;
	$scope.selectedOrigin = $scope.locations[0].locode
	$scope.selectedDestination = $scope.locations[0].locode
    });
    $scope.selectOrigin = function (locode) { $scope.selectedOrigin = locode; }
    $scope.selectDestination = function (locode) { $scope.selectedDestination = locode; }

    // Books a cargo with selected origin, destinal and arrival deadline and closes the modal.
    $scope.bookCargo = function () {
	var deadlineDate = new Date($scope.deadline).getTime();
	BookingService.bookCargo($scope.selectedOrigin, $scope.selectedDestination, deadlineDate).$promise.then(function(data) {
	    $modalInstance.close(data);
	});
    }

    // Dismiss the modal.
    $scope.cancel = function () {
	$modalInstance.dismiss('cancel');
    };
});

app.controller('CargoDetailsCtrl', function ($scope, $modal, $location, BookingService) {
    var trackingId = $location.search().trackingId;
    $scope.cargo = BookingService.getCargo(trackingId);

    $scope.open = function () {
	var modalInstance = $modal.open({
	    templateUrl: 'template/changeDestination.html',
	    controller: 'ChangeDestinationCtrl',
	    resolve: {
		cargo: function(BookingService) {
		    return BookingService.getCargo(trackingId);
		}
	    }
	});

	modalInstance.result.then(function (data) {
	    $scope.cargo = data;
	});
    };
});

app.controller('ChangeDestinationCtrl', function ($scope, $modalInstance, cargo, BookingService) {
    // Populate location dropdown
    BookingService.getLocations().$promise.then(function(data) {
	$scope.locations = data;
	$scope.selectedDestination = cargo.destination;
    });
    $scope.selectDestination = function (locode) { $scope.selectedDestination = locode; }

    // Change destination and close the modal.
    $scope.changeDestination = function () {
	BookingService.changeDestination(cargo.trackingId, $scope.selectedDestination).$promise.then(function () {
	    $scope.cargo = BookingService.getCargo(cargo.trackingId);
	    $modalInstance.close($scope.cargo);
	});
    }

    // Dismiss the modal.
    $scope.cancel = function () {
	$modalInstance.dismiss('cancel');
    };
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
