'use strict';

(function() {
    var LoginFactory = function ($resource) {
        // Private
        var uri = '/login';

        // Public
        return $resource(uri, {}, {
            isLogged: {method: 'GET'},
            logIn   : {method: 'POST'},
            logOut  : {method: 'DELETE'}
        });
    };

    // Injection annotation
    LoginFactory.$inject = ['$resource'];

    var LoginService = function() {
        this.isLogged = function() {

        };

        this.logIn = function() {

        };

        this.logOut = function() {

        };
    };

    // Create controller
    angular
        .module('chatApp')
        .factory('LoginFactory', LoginFactory)
        .service('LoginService', LoginService);
})();