'use strict';

angular.module('chatApp')
 	.controller('RegisterCtrl', function ($scope, $http, $location) {

 		$scope.user = {};

		$scope.register = function(form) {
		
			// Trigger validation flag
			$scope.submitted = true;

			// If form is invalid, return and let AngularJS show validation errors
			if (form.$invalid) {
				return;
			}

			// Submit form to server
			$http({
				method : 'POST',
				url    : 'http://localhost:3000/register',
				data   : {
					'login'   : $scope.user.login,
					'password': $scope.user.password,
					'email'   : $scope.user.email,
					'gender'  : $scope.user.gender
				}
			}).
			success(function(data, status, headers, config) {
				if (data.success) {
					// User succesfully register, redirect to chat
					$location.path('/chat');
				} else {
					// User wasn't registered, show error
					switch(data.msg) {
						case 'USER_EXISTS':
							form.userLogin.$setValidity('exists', false);
							break;
					}
				}
			}).
			error(function(data, status, headers, config) {
				console.error('Could\'nt send register request');
			});
		};
 	});
