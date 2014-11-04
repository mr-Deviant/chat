'use strict';

(function() {
    var ChatCtrl = function ($scope, $http, $location) {

    	$scope.logout = function() {
			$http.get('http://localhost:3000/logout').
			success(function() {
				$location.path('/login');
			});
    	};
    };

    // Injection annotation
    ChatCtrl.$inject = ['$scope', '$http', '$location'];

    // Create controller
    angular
        .module('chatApp')
        .controller('ChatCtrl', ChatCtrl);
})();