/**
 * Created by W.Y.Park on 2015-03-02.
 */

var myBadukApp = angular.module('badukApp', ['d3']);

myBadukApp.config(['$routeProvider', function($routeProvider) {
    $routeProvider
        .when('/home', {
            templateUrl: 'views/home.html',
            controller: 'homeCtrl'
        })
        .when('/deagook', {
            templateUrl: 'views/deagook.html',
            controller: 'deagookCtrl'
        })
        .otherwise({
            redirectTo: '/home'
        });
}]);

myBadukApp.controller("homeCtrl", function ($scope) {
    $scope.message = "Hello !!!!";
});

myBadukApp.controller("deagookCtrl", function ($scope) {
    $scope.showCircles = true;
    $scope.toggleCircleBtnClass = ['btn', 'btn-xs', 'btn-info'];
    $scope.showSquares = true;
    $scope.toggleSquaresBtnClass = ['btn', 'btn-xs', 'btn-info'];
    $scope.currentDolColor = "black";
    $scope.lines = [];
    $scope.dotCircles = [];
    $scope.circles = [];
    $scope.squares = [];
    $scope.width = 2000;
    $scope.height = 2000;
    $scope.dx = $scope.width / 20;
    $scope.dy = $scope.height / 20;
    $scope.startX = $scope.dx;
    $scope.startY = $scope.dy;
    $scope.endX = $scope.width - $scope.dx;
    $scope.endY = $scope.height - $scope.dy;
    $scope.lineRenderer = function(el, data) {
        var l = el.selectAll('line').data($scope.lines);
        l.enter()
            .append('line')
            .attr("x1", function(d) { return d.x1; })
            .attr("y1", function(d) { return d.y1; })
            .attr("x2", function(d) { return d.x2; })
            .attr("y2", function(d) { return d.y2; });
        var c = el.selectAll('circle').data($scope.dotCircles);
        c.enter()
            .append("circle")
            .attr('cx', $scope.width / 2)
            .attr('cy', $scope.height / 2)
            .attr('opacity', function(d) { return d.opacity; })
            .style('fill', function(d) { return d.fill; })
            .transition()
            .duration(1000)
            .attr('cx', function(d) { return d.cx; })
            .attr('cy', function(d) { return d.cy; })
            .attr('r', function(d) { return d.r;});
    };
    $scope.addLines = function() {
        d3.range($scope.startX, $scope.endX + 1, $scope.dx).forEach(function(d) {
            $scope.lines.push({x1: d, y1: $scope.startY, x2: d, y2: $scope.endY});
        });
        d3.range($scope.startY, $scope.endY + 1, $scope.dy).forEach(function(d) {
            $scope.lines.push({x1: $scope.startX, y1: d, x2: $scope.endX, y2: d});
        });
    };
    $scope.addDotCircles = function() {
        var dotArr = [
            {x:4, y:4}, {x:4, y:10}, {x:4, y:16},
            {x:10, y:4}, {x:10, y:10}, {x:10, y:16},
            {x:16, y:4}, {x:16, y:10}, {x:16, y:16}
        ];
        dotArr.forEach(function(d) {
            $scope.dotCircles.push({cx: $scope.dx * d.x, cy: $scope.dy * d.y, r: 15, fill: "black", opacity: 1});
        })
    };
    $scope.addLines();
    $scope.addDotCircles();
    $scope.circleRenderer = function(el, data) {
        var d = el.selectAll('circle').data($scope.circles);
        d.enter()
            .append('circle')
            .on("click", $scope.updateCircle)
            .attr('cx', $scope.width / 2)
            .attr('cy', $scope.height / 2)
            .attr('opacity', 1)
            .style('fill', function(d) { return d.fill; })
            .transition()
            .duration(1000)
            .attr('opacity', function(d) { return d.opacity; })
            .attr('cx', function(d) { return d.cx; })
            .attr('cy', function(d) { return d.cy; })
            .attr('r', function(d) { return d.r;});
        d.exit()
            .transition()
            .duration(1000)
            .attr('cx', $scope.width / 2)
            .attr('cy', $scope.height / 2)
            .attr('r', 0)
            .remove();
    };
    $scope.addCircles = function() {
        if ($scope.circles.length > 0) {
            return false;
        }
        var r = Math.min($scope.dx, $scope.dy) / 2 - 2;
        for(var x = 1; x < 20; x++) {
            for(var y = 1; y < 20; y++) {
                $scope.circles.push({cx: x *  $scope.dx, cy: y * $scope.dy, r: r, fill: "green", opacity: 0});
            }
        }
    };
    $scope.addCircles();
    $scope.updateCircle = function() {
        var data = d3.select(this).data()[0];
        if ("green" == data.fill) {
            data.fill = $scope.currentDolColor;
            data.opacity = 1;
            $scope.currentDolColor = "black" == $scope.currentDolColor ? "white" : "black";
        }
        else {
            data.fill = "green";
            data.opacity = 0;
        }
        d3.select(this)
            .attr('opacity', 0)
            .style('fill', data.fill)
            .transition()
            .duration(1000)
            .attr('opacity', data.opacity)
            .style('fill', data.fill);
        $scope.$apply();
    };
    $scope.clearCircles = function() {
        $scope.circles = [];
    };
    $scope.toggleCircleVisibility = function() {
        $scope.showCircles = !$scope.showCircles;
        if($scope.showCircles) $scope.toggleCircleBtnClass = ['btn', 'btn-xs', 'btn-info'];
        else $scope.toggleCircleBtnClass = ['btn', 'btn-xs', 'btn-danger'];
    };
    $scope.squareRenderer = function(el, data) {
        var d = el.selectAll('rect').data($scope.squares);
        d.enter()
            .append('rect')
            .attr('x', $scope.width / 2)
            .attr('y', $scope.height / 2)
            .attr('width', 0)
            .attr('height', 0)
            .style('fill', function() { return 'rgb(' + parseInt(Math.random() * 255) + ',' + parseInt(Math.random() * 255) + ',' + parseInt(Math.random() * 255) + ')'; })
            .transition()
            .duration(1000)
            .attr('x', function(d) { return d.x - d.size / 2; })
            .attr('y', function(d) { return d.y - d.size / 2; })
            .attr('width', function(d) { return d.size; })
            .attr('height', function(d) { return d.size; });
        d.exit()
            .transition()
            .duration(1000)
            .attr('x', $scope.width / 2)
            .attr('y', $scope.height / 2)
            .attr('width', 0)
            .attr('height', 0)
            .remove();
    };
    $scope.addSquares = function() {
        for (var i = 0; i < 50; i++) {
            var x = (Math.round((Math.random() * ($scope.endX - $scope.startX) / $scope.dx)) + 1) *  $scope.dx;
            var y = (Math.round((Math.random() * ($scope.endY - $scope.startY) / $scope.dy)) + 1) *  $scope.dy;
            var s = Math.min($scope.dx, $scope.dy) * 0.75 ;
            $scope.squares.push({x: x, y: y, size: s});
            //$scope.squares.push({x: Math.random() * $scope.width, y: Math.random() * $scope.height, size: Math.random() * 50});
        }
    };
    $scope.clearSquares = function() {
        $scope.squares = [];
    };
    $scope.toggleSquareVisibility = function() {
        $scope.showSquares = !$scope.showSquares;
        if($scope.showSquares) $scope.toggleSquaresBtnClass = ['btn', 'btn-xs', 'btn-info'];
        else $scope.toggleSquaresBtnClass = ['btn', 'btn-xs', 'btn-danger'];
    };
});