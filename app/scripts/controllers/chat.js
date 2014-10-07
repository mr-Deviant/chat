'use strict';

(function() {
    var ChatCtrl = function ($scope) {

    };

    // Injection annotation
    ChatCtrl.$inject = ['$scope'];

    // Create controller
    angular
        .module('chatApp')
        .controller('ChatCtrl', ChatCtrl);
})();