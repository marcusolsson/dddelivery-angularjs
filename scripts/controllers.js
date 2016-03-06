var app = angular.module("app");

app.controller('TrackCtrl', function($scope, TrackingService) {
    $scope.showCargo = function(trackingId) {
        TrackingService.getCargo(trackingId).$promise.then(function(result) {
            $scope.cargo = result.cargo;
        });
    }
});

app.controller('ListCtrl', function($scope, $modal, $location, BookingService) {
    BookingService.getCargos().$promise.then(function(result) {
        $scope.cargos = result.cargos;
    });

    // Method to open dialog for booking a cargo.
    $scope.open = function() {
        var modalInstance = $modal.open({
            templateUrl: 'views/bookCargo.html',
            controller: 'BookCargoCtrl'
        });

        // Redirect to details page if cargo was booked.
        modalInstance.result.then(function(bookedCargo) {
            $location.path('/details').search('trackingId', bookedCargo.tracking_id);
        });
    };
});

app.controller('BookCargoCtrl', function($scope, $location, BookingService, $modalInstance) {
    // Populate location dropdowns
    BookingService.getLocations().$promise.then(function(result) {
        $scope.locations = result.locations;
        $scope.selectedOrigin = $scope.locations[0].locode
        $scope.selectedDestination = $scope.locations[0].locode
    });
    $scope.selectOrigin = function(locode) {
        $scope.selectedOrigin = locode;
    }
    $scope.selectDestination = function(locode) {
        $scope.selectedDestination = locode;
    }

    // Books a cargo with selected origin, destinal and arrival deadline and closes the modal.
    $scope.bookCargo = function() {
        BookingService.bookCargo($scope.selectedOrigin, $scope.selectedDestination, $scope.deadline.toISOString()).$promise.then(function(result) {
            $modalInstance.close(result);
        });
    }

    // Dismiss the modal.
    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };
});

app.controller('DetailsCtrl', function($scope, $modal, $location, BookingService) {
    var trackingId = $location.search().trackingId;
    BookingService.loadCargo(trackingId).$promise.then(function(result) {
        $scope.cargo = result.cargo;
    });

    $scope.open = function() {
        var modalInstance = $modal.open({
            templateUrl: 'views/changeDestination.html',
            controller: 'ChangeDestinationCtrl',
            resolve: {
                cargo: function(BookingService) {
                    return BookingService.loadCargo(trackingId).$promise;
                }
            }
        });

        modalInstance.result.then(function(data) {
            $scope.cargo = data.cargo;
        });
    };
});

app.controller('ChangeDestinationCtrl', function($scope, $modalInstance, cargo, BookingService) {
    cargo = cargo.cargo;

    // Populate location dropdown
    BookingService.getLocations().$promise.then(function(result) {
        $scope.locations = result.locations;
        $scope.selectedDestination = cargo.destination;
    });
    $scope.selectDestination = function(locode) {
        $scope.selectedDestination = locode;
    }

    // Change destination and close the modal.
    $scope.changeDestination = function() {
        BookingService.changeDestination(cargo.tracking_id, $scope.selectedDestination).$promise.then(function() {
            BookingService.loadCargo(cargo.tracking_id).$promise.then(function(result) {
                $modalInstance.close(result);
            });
        });
    }

    // Dismiss the modal.
    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };
});

app.controller('SelectItineraryCtrl', function($scope, $location, BookingService) {
    var trackingId = $location.search().tracking_id;

	BookingService.loadCargo(trackingId).$promise.then(function(result){
	    $scope.cargo = result.cargo;
	});

    BookingService.requestPossibleRoutes(trackingId).$promise.then(function(result) {
        $scope.routeCandidates = result.routes;
    });

    $scope.assignToRoute = function(itinerary) {
        BookingService.assignToRoute(trackingId, itinerary).$promise.then(function() {
            $location.path('/details').search('trackingId', trackingId);
        });
    }
});

app.controller('SelectBackendCtrl', function($scope, $window, BackendService) {
    $scope.backends = BackendService.getAll();
    $scope.currentBackend = BackendService.getCurrent();

    $scope.selectBackend = function(b) {
        $scope.currentBackend = b;
        BackendService.select(b);
        $window.location.reload();
    }
});

app.controller('IncidentLoggingCtrl', function($scope, IncidentService) {
    $scope.eventTypes = ['Receive', 'Load', 'Unload', 'Customs', 'Claim'];
    $scope.selectedEventType = $scope.eventTypes[0];

    $scope.selectEventType = function(type) {
        $scope.selectedEventType = type;
    };

    $scope.registerIncident = function() {
        IncidentService.registerIncident($scope.completionTime.toISOString(), $scope.trackingId, $scope.voyage, $scope.location, $scope.selectedEventType).$promise.then(function(data) {
            $scope.showMessage = true;
            $scope.showError = false;
        }, function(error) {
            $scope.showError = true;
            $scope.showMessage = false;
        })
	};
});
