var app = angular.module("app");

app.factory("BookingService", function (Location, Cargo, AssignToRoute, RouteCandidates, Destination) {
    return {
	getCargos: function() {
	    return Cargo.list(function(data) {
		return data;
	    });
	},
	getCargo: function(trackingId) {
	    return Cargo.find({ id: trackingId }, function(data) {
		return data;
	    });
	},
	bookCargo: function(origin, destination, arrivalDeadline) {
	    return Cargo.book({
		origin: origin,
		destination: destination,
		arrivalDeadline: arrivalDeadline
	    }, function(data) {
		return data;
	    });
	},
	assignToRoute: function(trackingId, itinerary) {
	    return AssignToRoute.assign({ id: trackingId }, itinerary, function (data) {
		return data;
	    });
	},
	requestPossibleRoutes: function(trackingId) {
	    return RouteCandidates.request({ id: trackingId }, function (data) {
		return data;
	    });
	},
	changeDestination: function(trackingId, destination) {
	    return Destination.change({id: trackingId, destination: destination}, function (data) {
		return data;
	    });
	},
	getLocations: function() {
	    return Location.list(function (data){
		return data;
	    });
	}

    };
});

app.factory("Cargo", function($resource) {
    return $resource("http://murmuring-oasis-1247.herokuapp.com/cargos/:id", null, {
	'find': {method: 'GET', params: {id: "@id"}},
	'list': {method: 'GET', isArray: true},
	'book': {method: 'POST', params: {origin: "@origin", destination: "@destination", arrivalDeadline: "@arrivalDeadline"}}
    });
});

app.factory("Location", function($resource) {
    return $resource("http://murmuring-oasis-1247.herokuapp.com/locations", null, {
	'list': {method: 'GET', isArray: true}
    });
});

app.factory("Destination", function($resource) {
    return $resource("http://murmuring-oasis-1247.herokuapp.com/cargos/:id/change_destination", null, {
	'change': {method: 'POST', params: {id: "@id", destination: "@destination"}}
    });
});

app.factory("AssignToRoute", function($resource) {
    return $resource("http://murmuring-oasis-1247.herokuapp.com/cargos/:id/assign_to_route", null, {
	'assign': {method: 'POST', params: {id: "@id"}}
    });
});

app.factory("RouteCandidates", function($resource) {
    return $resource("http://murmuring-oasis-1247.herokuapp.com/cargos/:id/request_routes", null, {
	'request': {method: 'GET', isArray: true, params: {id: "@id"}}
    });
});
