'use strict';

angular.module('chatApp')
	.controller('LoginCtrl', function ($scope, $http) {
		$scope.user = {};

		$scope.login = function(form) {
		
			// Trigger validation flag.
			$scope.submitted = true;

			// If form is invalid, return and let AngularJS show validation errors.
			if (form.$invalid) {
				return;
			}

			// Submit form to server
			$http({
				method : 'POST',
				url    : '/login',
				data   : 'login=' + $scope.user.login + '&email=' + $scope.user.email,
				// headers: {
				//     'Content-Type': 'application/x-www-form-urlencoded'
				// }
			});
		};
	});