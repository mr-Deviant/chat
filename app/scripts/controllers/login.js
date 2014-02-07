'use strict';

angular.module('chatApp')
	.controller('LoginCtrl', function ($scope, $http) {
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
				url    : '/login',
				data   : {
					'login': $scope.user.login,
					'email': $scope.user.email,
				}
			}).
			success(function(data, status, headers, config) {
				if (data.success) {
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
			error(function(data, status, headers, config) {
				console.error('Could\'nt send login request');
			});
		};
	});


if (data.success) {
					// User succesfully register, redirect to chat
					$location.path('/chat');
				} else {
					// User wasn't registered, show error
					if (data.msg === 'USER_EXISTS') {
						form.userLogin.$setValidity('exists', false);
					}
				}