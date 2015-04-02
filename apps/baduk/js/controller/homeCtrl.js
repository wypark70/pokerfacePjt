/**
 * Created by W.Y.Park on 2015-03-02.
 */

'use strict';

define([], function () {
    function homeCtrl($scope) {
        $scope.message = "Hello !!!!";
    };
    homeCtrl.$inject = ['$scope'];
    return homeCtrl;
});