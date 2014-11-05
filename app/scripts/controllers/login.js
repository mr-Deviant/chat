'use strict';

angular.module('chatApp')
	.controller('LoginCtrl', function ($scope, $http, $location) {
		$scope.user = {};

		$scope.login = function(form) {
		
			// Trigger validation flag.
			$scope.submitted = true;

			// Reset previous server side errors
			form.userLogin.$setValidity('notExists', true);
			form.userPassword.$setValidity('passwordWrong', true);

			// If form is invalid, return and let AngularJS show validation errors.
			if (form.$invalid) {
				return;
			}

			// Submit form to server
			$http({
				method : 'POST',
				url    : 'http://localhost:3000/login',
				data   : {
					'login'   : $scope.user.login,
					'password': $scope.user.password
				}
			}).
			success(function(data) {
				if (data.ok) {
					// User succesfully login, redirect to chat
					$location.path('/chat');
				} else {
					// User wasn't logined, show error
					switch(data.msg) {
						case 'USER_NOT_EXISTS':
							form.userLogin.$setValidity('notExists', false);
							break;
						case 'PASSWORD_WRONG':
							form.userPassword.$setValidity('passwordWrong', false);
							break;
					}
				}
			}).
			error(function() {
				console.error('Could not send login request');
			});
		};
	});