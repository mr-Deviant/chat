'use strict';

angular.module('chatApp')
 	.controller('RegisterCtrl', function ($scope, $http) {
 		$scope.user = {};

		$scope.register = function() {
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
