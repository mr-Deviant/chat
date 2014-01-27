'use strict';

angular.module('chatApp')
 	.controller('RegisterCtrl', function ($scope, $http) {

 		$scope.user = {};

		$scope.register = function(form) {
		
			// Trigger validation flag.
			$scope.submitted = true;

			// If form is invalid, return and let AngularJS show validation errors.
			if (form.$invalid) {
				return;
			}

			// Submit form to server
			$http({
				method : 'POST',
				url    : '/register',
				data   : 'login=' + $scope.user.login + '&email=' + $scope.user.email,
				// headers: {
				//     'Content-Type': 'application/x-www-form-urlencoded'
				// }
			});
		};
 	});
