/**
 * Created by W.Y.Park on 2015-03-02.
 */

'use strict';

define([], function() {
    function config($routeProvider) {
        $routeProvider
            .when('/home', {
                templateUrl: 'view/home.html',
                controller: 'homeCtrl'
            })
            .when('/waitingRoom', {
                templateUrl: 'view/waitingRoom.html',
                controller: 'waitingRoomCtrl'
            })
            .when('/deagook', {
                templateUrl: 'view/deagook.html',
                controller: 'deagookCtrl'
            })
            .when('/gibo', {
                templateUrl: 'view/gibo.html',
                controller: 'giboCtrl'
            })
            .otherwise({
                redirectTo: '/home'
            });
    };
    config.$inject = ['$routeProvider'];
    return config;
});
