/**
 * Created by W.Y.Park on 2015-03-02.
 */

'use strict';

define([], function() {
    function deagookCtrl($scope) {
        $scope.showCircles = true;
        $scope.toggleCircleBtnClass = ['btn', 'btn-xs', 'btn-info'];
        $scope.showSquares = true;
        $scope.toggleSquaresBtnClass = ['btn', 'btn-xs', 'btn-info'];
        $scope.currentDolColor = 'url(#gradient_3D_black)';
        $scope.lines = [];
        $scope.dotCircles = [];
        $scope.panCircles = [];
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
        $scope.r = Math.min($scope.dx, $scope.dy) / 2 - 5;
        $scope.panRenderer = function(el, data) {
            var l = el.selectAll('line').data($scope.lines);
            l.enter()
                .append('line')
                .attr("x1", function(d) { return d.x1; })
                .attr("y1", function(d) { return d.y1; })
                .attr("x2", function(d) { return d.x2; })
                .attr("y2", function(d) { return d.y2; });
            var c1 = el.selectAll('circle.dotCircle').data($scope.dotCircles);
            c1.enter()
                .append("circle")
                .attr('class', 'dotCircle')
                .attr('cx', 10 * $scope.dx)
                .attr('cy', 10 * $scope.dy)
                .attr('r', 0)
                .attr('opacity', 0)
                .style('fill', function(d) { return d.fill; })
                .transition()
                .duration(1000)
                .attr('cx', function(d) { return d.x * $scope.dx; })
                .attr('cy', function(d) { return d.y * $scope.dy; })
                .attr('r', function(d) { return d.r;})
                .attr('opacity', function(d) { return d.opacity; });
            var c2 = el.selectAll('circle.panCircle').data($scope.panCircles);
            c2.enter()
                .append('circle')
                .on("click", $scope.addCircles)
                .attr('class', 'panCircle')
                .attr('cx', 10 * $scope.dx)
                .attr('cy', 10 * $scope.dy)
                .attr('opacity', 1)
                .style({'fill': function(d) { return d.fill; }, "cursor": "hand"})
                .transition()
                .duration(1000)
                .attr('cx', function(d) { return d.x * $scope.dx; })
                .attr('cy', function(d) { return d.y * $scope.dy; })
                .attr('r', function(d) { return d.r;})
                .attr('opacity', function(d) { return d.opacity; });
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
                $scope.dotCircles.push({x: d.x, y: d.y, r: 7, fill: 'black', opacity: 1});
            })
        };
        $scope.addPanCircles = function() {
            for(var x = 1; x < 20; x++) {
                for(var y = 1; y < 20; y++) {
                    $scope.panCircles.push({x: x, y: y, r: $scope.r, fill: 'url(#gradient_3D_gray)', opacity: 0});
                }
            }
            d3.shuffle($scope.panCircles);
        };
        $scope.addLines();
        $scope.addDotCircles();
        $scope.addPanCircles();
        $scope.giboRenderer = function(el, data) {
            var c = el.selectAll('circle').data($scope.circles);
            c.attr('opacity', function(d) { return d.opacity; })
                .attr('cx', function(d) { return d.x * $scope.dx; })
                .attr('cy', function(d) { return d.y * $scope.dy; })
                .attr('r', function(d) { return d.r; });
            c.enter()
                .append('circle')
                .on("click", $scope.hideCircles)
                .attr('cx', 10 * $scope.dx)
                .attr('cy', 10 * $scope.dy)
                .attr('opacity', 0)
                .style({'fill': function(d) { return d.fill; }, "cursor": "hand"})
                .transition()
                .duration(10)
                .attr('opacity', function(d) { return d.opacity; })
                .attr('cx', function(d) { return d.x * $scope.dx; })
                .attr('cy', function(d) { return d.y * $scope.dy; })
                .attr('r', function(d) { return d.r; });
            c.exit()
                .transition()
                .duration(1000)
                .attr('cx', 10 * $scope.dx)
                .attr('cy', 10 * $scope.dy)
                .attr('r', 0)
                .remove();
            var t = el.selectAll("text").data($scope.circles);
            t.attr('opacity', function(d) { return d.opacity; })
                .text(function (d, i) {return d.opacity == 0 ? '' : i + 1;});
            t.enter()
                .append('text')
                .on("click", $scope.hideCircles)
                .attr({"dx": function(d) {return 10 * $scope.dx;}, "dy": function(d) {return 10 * $scope.dy;}, "text-anchor": "middle", "alignment-baseline": "middle"})
                .style({"fill": function(d) {return d.fill;}, "font-size": "0px", "font-weight": "bold"})
                .transition()
                .duration(10)
                .text(function (d, i) {return i + 1;})
                .attr({"dx": function(d) {return d.x * $scope.dx;}, "dy": function(d) {return d.y * $scope.dy;}, "text-anchor": "middle", "alignment-baseline": "middle"})
                .style({"fill": function(d) {return 'url(#gradient_3D_white)' === d.fill ? 'url(#gradient_3D_black)' : 'url(#gradient_3D_white)';}, "font-size": "40", "font-weight": "bold", "cursor": "hand"});
            t.exit()
                .transition()
                .duration(1000)
                .attr({"dx": function(d) {return 10 * $scope.dx;}, "dy": function(d) {return 10 * $scope.dy;}, "text-anchor": "middle", "alignment-baseline": "middle"})
                .style({"fill": function(d) {return d.fill;}, "font-size": "0", "font-weight": "bold"})
                .remove();
        };
        $scope.addCircles = function() {
            var data = d3.select(this).data()[0];
            console.log(new Date(), ": ", data);
            $scope.circles.push({x: data.x, y: data.y, r: data.r, fill: $scope.currentDolColor, opacity: 1});
            $scope.currentDolColor = 'url(#gradient_3D_white)' == $scope.currentDolColor ? 'url(#gradient_3D_black)' : 'url(#gradient_3D_white)';
            $scope.$apply();
        };
        $scope.hideCircles = function() {
            var data = d3.select(this).data()[0];
            var curData = $scope.circles[$scope.circles.indexOf(data)];
            curData.r = 0;
            curData.opacity = 0;
            curData.fill = "none";
            $scope.$apply();
        };
        $scope.addCirclesRandom = function() {
            for (var i = 0; i < Math.round(Math.random() * 30 + 20); i++) {
                var x = Math.round(Math.random() * 18) + 1;
                var y = Math.round(Math.random() * 18) + 1;
                var tmpArr = $scope.circles.filter(function(d) { return x == d.x && y == d.y });
                if (tmpArr.length == 0) {
                    $scope.circles.push({x: x, y: y, r: $scope.r, fill: $scope.currentDolColor, opacity: 1});
                    $scope.currentDolColor = 'url(#gradient_3D_white)' == $scope.currentDolColor ? 'url(#gradient_3D_black)' : 'url(#gradient_3D_white)';
                }
            }
        };
        $scope.removeCircle = function() {
            $scope.circles.pop();
            $scope.currentDolColor = 'url(#gradient_3D_white)' == $scope.currentDolColor ? 'url(#gradient_3D_black)' : 'url(#gradient_3D_white)';
        };
        $scope.clearCircles = function() {
            $scope.circles = [];
            $scope.currentDolColor = 'url(#gradient_3D_black)';
        };
        $scope.toggleCircleVisibility = function() {
            $scope.showCircles = !$scope.showCircles;
            if($scope.showCircles) $scope.toggleCircleBtnClass = ['btn', 'btn-xs', 'btn-info'];
            else $scope.toggleCircleBtnClass = ['btn', 'btn-xs', 'btn-danger'];
        };
        $scope.squareRenderer = function(el, data) {
            var r = el.selectAll('rect').data($scope.squares);
            r.enter()
                .append('rect')
                .attr('x', 10 * $scope.dx)
                .attr('y', 10 * $scope.dy)
                .attr('width', 0)
                .attr('height', 0)
                .attr('filter', "url(#f4)")
                .style('fill', function() {return 'rgb(' + parseInt(Math.random() * 255) + ',' + parseInt(Math.random() * 255) + ',' + parseInt(Math.random() * 255) + ')';})
                .transition()
                .duration(1000)
                .delay(function(d, i) {return i * 10;})
                .attr('x', function(d) { return d.x * $scope.dx - d.size / 2; })
                .attr('y', function(d) { return d.y * $scope.dy - d.size / 2; })
                .attr('width', function(d) { return d.size; })
                .attr('height', function(d) { return d.size; });
            r.exit()
                .transition()
                .duration(1000)
                .delay(function(d, i) {return i * 10;})
                .attr('x', 10 * $scope.dx)
                .attr('y', 10 * $scope.dy)
                .attr('width', 0)
                .attr('height', 0)
                .remove();
            var t = el.selectAll("text").data($scope.squares);
            var textColor = 'rgb(' + parseInt(Math.random() * 255) + ',' + parseInt(Math.random() * 255) + ',' + parseInt(Math.random() * 255) + ')';
            t.enter()
                .append('text')
                .text(function (d, i) {return i + 1;})
                .attr({"dx": 10 * $scope.dx, "dy": 10 * $scope.dy, "text-anchor": "middle", "alignment-baseline": "middle"})
                .style({"fill": function(d) {return textColor;}, "font-size": "0", "font-weight": "bold"})
                .transition()
                .duration(1000)
                .delay(function(d, i) {return i * 10;})
                .attr({"dx": function(d) {return d.x * $scope.dx;}, "dy": function(d) {return d.y * $scope.dy;}, "text-anchor": "middle", "alignment-baseline": "middle"})
                .style({"fill": function(d) {return textColor;}, "font-size": "40", "font-weight": "bold"});
            t.exit()
                .transition()
                .duration(1000)
                .delay(function(d, i) {return i * 10;})
                .attr({"dx": 10 * $scope.dx, "dy": 10 * $scope.dy})
                .style({"font-size": "0px"})
                .remove();
        };
        $scope.addSquares = function() {
            for (var i = 0; i < 50; i++) {
                var x = Math.round((Math.random() * 18)) + 1;
                var y = Math.round((Math.random() * 18)) + 1;
                var s = $scope.r * 2 - 10;
                $scope.squares.push({x: x, y: y, size: s});
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
        /*
        d3.timer(function() {
            var x = Math.round(Math.random() * 18) + 1;
            var y = Math.round(Math.random() * 18) + 1;
            $scope.circles.push({cx: x *  $scope.dx, cy: y * $scope.dy, $scope.r: $scope.r, fill: $scope.currentDolColor, opacity: 1});
            $scope.currentDolColor = "black" == $scope.currentDolColor ? "white" : "black";
            if ($scope.circles.length > 99) return true;
            $scope.$apply();
        });
        */
    }

    deagookCtrl.$inject = ['$scope'];

    return deagookCtrl;
});