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
				data   : {
					'login'   : $scope.user.login,
					'password': $scope.user.password,
					'email'   : $scope.user.email,
					'gender'  : $scope.user.gender
				}
				// headers: {
				//     'Content-Type': 'application/x-www-form-urlencoded'
				// }
			}).
			success(function(data, status, headers, config) {
				console.log(data.success);
			}).
			error(function(data, status, headers, config) {
				console.error('Could\'nt send register request');
			});
		
		};
 	});
