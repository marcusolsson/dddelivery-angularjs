var app = angular.module("app");

app.factory("BackendService", function($cookieStore) {
    var backends = [{
        host: 'http://dddsample.marcusoncode.se',
        description: 'Go (Marcus Olsson)'
    },
        {
            host: 'http://localhost:3000',
            description: 'localhost:3000'
        }];

    return {
        select: function(b) {
            $cookieStore.put('currentBackend', b);
        },
        getCurrent: function() {
            return $cookieStore.get('currentBackend') || backends[0];
        },
        getAll: function() {
            return backends;
        }
    };
});

app.factory("IncidentService", function(Incident) {
    return {
        registerIncident: function(completionTime, trackingId, voyage, location, eventType) {
            return Incident.register({
                completion_time: completionTime,
                tracking_id: trackingId,
                voyage: voyage,
                location: location,
                event_type: eventType
            }, function(data) {
                return data;
            });
        }
    };
})

app.factory("BookingService", function(Location, BookingCargo, AssignToRoute, RouteCandidates, Destination) {
    return {
        getCargos: function() {
            return BookingCargo.list(function(data) {
                return data
            });
        },
        loadCargo: function(trackingId) {
            return BookingCargo.load({
                id: trackingId
            }, function(data) {
                return data;
            });
        },
        bookCargo: function(origin, destination, arrivalDeadline) {
            return BookingCargo.book({
                origin: origin,
                destination: destination,
                arrival_deadline: arrivalDeadline
            }, function(data) {
                return data;
            });
        },
        assignToRoute: function(trackingId, itinerary) {
            return AssignToRoute.assign({
                id: trackingId
            }, itinerary, function(data) {
                return data;
            });
        },
        requestPossibleRoutes: function(trackingId) {
            return RouteCandidates.request({
                id: trackingId
            }, function(data) {
                return data;
            });
        },
        changeDestination: function(trackingId, destination) {
            return Destination.change({
                id: trackingId,
                destination: destination
            }, function(data) {
                return data;
            });
        },
        getLocations: function() {
            return Location.list(function(data) {
                return data.locations;
            });
        }

    };
});

app.factory("TrackingService", function(TrackingCargo) {
    return {
        getCargo: function(trackingId) {
            return TrackingCargo.track({
                id: trackingId
            }, function(data) {
                return data;
            });
        }
	}
});

app.factory("TrackingCargo", function($resource, BackendService) {
	console.log(BackendService.getCurrent().host);
	return $resource(BackendService.getCurrent().host + "/tracking/v1/cargos/:id", null, {
		'track': {
			method: 'GET',
			params: {
				id: "@id"
			}
		}
	});
})

app.factory("Incident", function($resource, BackendService) {
    return $resource(BackendService.getCurrent().host + "/handling/v1/incidents", null, {
        'register': {
            method: 'POST',
            data: {
                completion_time: "@completion_time",
                tracking_id: "@tracking_id",
                voyage: "@voyage",
                location: "@location",
                event_type: "@event_type"
            }
        }
    });
});

app.factory("BookingCargo", function($resource, BackendService) {
	return $resource(BackendService.getCurrent().host + "/booking/v1/cargos/:id", null, {
        'load': {
            method: 'GET',
            params: {
                id: "@id"
            }
        },
        'list': {
            method: 'GET'
        },
        'book': {
            method: 'POST',
            data: {
                origin: "@origin",
                destination: "@destination",
                arrival_deadline: "@arrival_deadline"
            }
        }
	});
});

app.factory("Location", function($resource, BackendService) {
    return $resource(BackendService.getCurrent().host + "/booking/v1/locations", null, {
        'list': {
            method: 'GET'
        }
    });
});

app.factory("Destination", function($resource, BackendService) {
    return $resource(BackendService.getCurrent().host + "/booking/v1/cargos/:id/change_destination", null, {
        'change': {
            method: 'POST',
            params: {
                id: "@id",
                destination: "@destination"
            }
        }
    });
});

app.factory("AssignToRoute", function($resource, BackendService) {
    return $resource(BackendService.getCurrent().host + "/booking/v1/cargos/:id/assign_to_route", null, {
        'assign': {
            method: 'POST',
            params: {
                id: "@id"
            }
        }
    });
});

app.factory("RouteCandidates", function($resource, BackendService) {
    return $resource(BackendService.getCurrent().host + "/booking/v1/cargos/:id/request_routes", null, {
        'request': {
            method: 'GET',
            params: {
                id: "@id"
            }
        }
    });
});
