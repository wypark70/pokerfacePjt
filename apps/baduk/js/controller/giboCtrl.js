/**
 * Created by W.Y.Park on 2015-03-02.
 */

'use strict';

define([], function () {
    function giboCtrl($scope) {
        $scope.message = "Hello !!!!";
    };
    giboCtrl.$inject = ['$scope'];
    return giboCtrl;
});