/**
 * Created by W.Y.Park on 2015-03-02.
 */

'use strict';

define([], function() {
    function deagookCtrl($scope) {
        $scope.showStone = true;
        $scope.toggleStoneBtnClass = ['btn', 'btn-xs', 'btn-info'];
        $scope.showSquares = true;
        $scope.toggleSquaresBtnClass = ['btn', 'btn-xs', 'btn-info'];

        $scope.width = 2000;
        $scope.height = 2000;
        $scope.dx = $scope.width / 20;
        $scope.dy = $scope.height / 20;
        $scope.startX = $scope.dx;
        $scope.startY = $scope.dy;
        $scope.endX = $scope.width - $scope.dx;
        $scope.endY = $scope.height - $scope.dy;
        $scope.r = Math.min($scope.dx, $scope.dy) / 2 - 5;

        $scope.panData = {lines: [], dotCircles: [], panCircles: []};
        $scope.giboData = {stones: []};
        $scope.squareData = {squares: []};

        $scope.panRenderer = function(el, data) {
            console.log(data);
            var line = el.selectAll('line').data(data.lines);
            line.enter()
                .append('line')
                .attr({"x1": function(d) {return d.x1;}, "y1": function(d) {return d.y1;}, "x2": function(d) {return d.x2;}, "y2": function(d) {return d.y2;}});
            var crc1 = el.selectAll('circle.dotCircle').data(data.dotCircles);
            crc1.enter()
                .append("circle")
                .attr({'class': 'dotCircle', 'cx': 10 * $scope.dx, 'cy': 10 * $scope.dy, 'r': 0, 'opacity': 0})
                .style('fill', 'black')
                .transition()
                .duration(1000)
                .attr({'cx': function(d) {return d.x * $scope.dx;}, 'cy': function(d) {return d.y * $scope.dy;}, 'r': function(d) {return d.r;}, 'opacity': 1});
            var crc2 = el.selectAll('circle.panCircle').data(data.panCircles);
            crc2.enter()
                .append('circle')
                .on("click", $scope.addStone)
                .attr({'class': 'panCircle', 'cx': 10 * $scope.dx, 'cy': 10 * $scope.dy, 'opacity': 1})
                .style({'fill': function(d) {return d.fill; }, "cursor": "hand"})
                .transition()
                .duration(1000)
                .attr({'cx': function(d) {return d.x * $scope.dx;}, 'cy': function(d) {return d.y * $scope.dy;}, 'r': function(d) {return d.r;}, 'opacity': 0});
        };
        $scope.addLines = function() {
            d3.range($scope.startX, $scope.endX + 1, $scope.dx).forEach(function(d) {
                $scope.panData.lines.push({x1: d, y1: $scope.startY, x2: d, y2: $scope.endY});
            });
            d3.range($scope.startY, $scope.endY + 1, $scope.dy).forEach(function(d) {
                $scope.panData.lines.push({x1: $scope.startX, y1: d, x2: $scope.endX, y2: d});
            });
        };
        $scope.addDotCircles = function() {
            var dotArr = [
                {x:4, y:4}, {x:4, y:10}, {x:4, y:16},
                {x:10, y:4}, {x:10, y:10}, {x:10, y:16},
                {x:16, y:4}, {x:16, y:10}, {x:16, y:16}
            ];
            dotArr.forEach(function(d) {
                $scope.panData.dotCircles.push({x: d.x, y: d.y, r: 7});
            })
        };
        $scope.addPanCircles = function() {
            for(var x = 1; x < 20; x++) {
                for(var y = 1; y < 20; y++) {
                    $scope.panData.panCircles.push({x: x, y: y, r: $scope.r});
                }
            }
            d3.shuffle($scope.panData.panCircles);
        };
        $scope.addLines();
        $scope.addDotCircles();
        $scope.addPanCircles();
        $scope.giboRenderer = function(el, data) {
            console.log(data);
            var crcl = el.selectAll('circle').data(data.stones);
            crcl.attr({'cx': function(d) {return d.x * $scope.dx;}, 'cy': function(d) {return d.y * $scope.dy;}, 'r': function(d) {return d.r;}, 'opacity': 1});
            crcl.enter()
                .append('circle')
                .on("click", $scope.hideCircles)
                .attr({'cx': 10 * $scope.dx, 'cy': 10 * $scope.dy, 'opacity': 0})
                .style({'fill': function(d) {return d.idxNo % 2 == 0 ? "url(#gradient_3D_black)" : "url(#gradient_3D_white)"; }, "cursor": "hand"})
                .transition()
                .duration(10)
                .attr({'cx': function(d) {return d.x * $scope.dx;}, 'cy': function(d) {return d.y * $scope.dy;}, 'r': function(d) {return d.r;}, 'opacity': 1});
            crcl.exit()
                .transition()
                .duration(1000)
                .attr({'cx': 10 * $scope.dx, 'cy': 10 * $scope.dy, 'r': 0})
                .remove();
            var text = el.selectAll("text").data(data.stones);
            text.attr('opacity', function (d) {return d.isShow ? 1 : 0;})
                .text(function (d) {return d.isShow ? d.idxNo + 1 : "";});
            text.enter()
                .append('text')
                .on("click", $scope.hideCircles)
                .attr({"dx": function(d) {return 10 * $scope.dx;}, "dy": function(d) {return 10 * $scope.dy;}, "text-anchor": "middle", "alignment-baseline": "middle"})
                .style({"fill": function(d) {return d.fill;}, "font-size": "0px", "font-weight": "bold"})
                .transition()
                .duration(10)
                .text(function (d) {return d.idxNo + 1;})
                .attr({"dx": function(d) {return d.x * $scope.dx;}, "dy": function(d) {return d.y * $scope.dy;}, "text-anchor": "middle", "alignment-baseline": "middle"})
                .style({"fill": function(d) {return d.idxNo % 2 == 0 ? 'url(#gradient_3D_white)' : 'url(#gradient_3D_black)';}, "font-size": "40", "font-weight": "bold", "cursor": "hand"});
            text.exit()
                .transition()
                .duration(1000)
                .attr({"dx": function(d) {return 10 * $scope.dx;}, "dy": function(d) {return 10 * $scope.dy;}, "text-anchor": "middle", "alignment-baseline": "middle"})
                .style({"fill": function(d) {return d.fill;}, "font-size": "0", "font-weight": "bold"})
                .remove();
        };
        $scope.addStone = function() {
            var data = d3.select(this).data()[0];
            console.log(new Date(), ": ", data);
            var newStone = {x: data.x, y: data.y, r: data.r, idxNo: $scope.giboData.stones.length, isShow: true};
            $scope.giboData.stones.push(newStone);
            $scope.hideStone(newStone);
            var linkedStone = $scope.findLinkedStone(newStone);
            var linkedBlankCnt = $scope.getLinkedBlankCnt(linkedStone);
            if (linkedBlankCnt == 0) {
                $scope.giboData.stones.pop();
            }
            $scope.$apply();
        };
        $scope.hideCircles = function() {
            /*
            var data = d3.select(this).data()[0];
            var baseStone = $scope.giboData.stones[$scope.giboData.stones.indexOf(data)];
            $scope.findLinkedStone(baseStone).forEach(function(stone) {
                var circle = $scope.giboData.stones[$scope.giboData.stones.indexOf(stone)];
                circle.opacity = 0.5;
            });
            $scope.$apply();
            */
        };
        $scope.findLinkedStone = function(baseStone) {
            function getLinkedStone(baseStone) {
                linkedStoneArr.push(baseStone);
                var filteredStone = $scope.giboData.stones.filter(function (d) {
                    var isNorthStone = baseStone.x === d.x && baseStone.y - 1 === d.y && baseStone.idxNo % 2 === d.idxNo % 2 && d.r > 0;
                    var isEastStone = baseStone.x === d.x + 1 && baseStone.y === d.y && baseStone.idxNo % 2 === d.idxNo % 2 && d.r > 0;
                    var isSouthStone = baseStone.x === d.x && baseStone.y + 1 === d.y && baseStone.idxNo % 2 === d.idxNo % 2 && d.r > 0;
                    var isWestStone = baseStone.x === d.x - 1 && baseStone.y === d.y && baseStone.idxNo % 2 === d.idxNo % 2 && d.r > 0;
                    return isNorthStone || isEastStone || isSouthStone || isWestStone;
                });
                if (filteredStone.length > 0) {
                    filteredStone.forEach(function (stone) {
                        var isExistsLinkedStoneArr = linkedStoneArr.filter(function (d) {
                                return stone.x === d.x && stone.y === d.y && stone.fill === d.fill;
                            }).length > 0;
                        if (!isExistsLinkedStoneArr) {
                            getLinkedStone(stone);
                        }
                    });
                }
            }
            var linkedStoneArr = [];
            getLinkedStone(baseStone);
            return linkedStoneArr;
        };
        $scope.hideStone = function(baseStone) {
            var filteredStone = $scope.giboData.stones.filter(function(d) {
                var isNorthStone = baseStone.x === d.x && baseStone.y - 1 === d.y && baseStone.idxNo % 2 != d.idxNo % 2 && d.r > 0;
                var isEastStone = baseStone.x === d.x + 1 && baseStone.y === d.y && baseStone.idxNo % 2 != d.idxNo % 2 && d.r > 0;
                var isSouthStone = baseStone.x === d.x && baseStone.y + 1 === d.y && baseStone.idxNo % 2 != d.idxNo % 2 && d.r > 0;
                var isWestStone = baseStone.x === d.x - 1 && baseStone.y === d.y && baseStone.idxNo % 2 != d.idxNo % 2 && d.r > 0;
                return isNorthStone || isEastStone || isSouthStone || isWestStone;
            });
            if (filteredStone.length > 0) {
                filteredStone.forEach(function(stone) {
                    var tmpLinkedStoneArr = $scope.findLinkedStone(stone);
                    var blankCnt = $scope.getLinkedBlankCnt(tmpLinkedStoneArr);
                    if (tmpLinkedStoneArr.length > 0 && blankCnt < 1) {
                        tmpLinkedStoneArr.forEach(function(tmpStone) {
                            var curData = $scope.giboData.stones[$scope.giboData.stones.indexOf(tmpStone)];
                            curData.r = 0;
                            curData.isShow = false;
                        });
                    }
                });
            }
        };
        $scope.getLinkedBlankCnt = function(linkedStoneArr) {
            var blankCnt = 0;
            linkedStoneArr.forEach(function(stone) {
                var maxBlankCnt = 4;
                if (stone.x < 2 || stone.x > 18) {
                    maxBlankCnt --;
                }
                if (stone.y < 2 || stone.y > 18) {
                    maxBlankCnt --;
                }
                var filteredStone = $scope.giboData.stones.filter(function(d) {
                    var isNorthStone = stone.x === d.x && stone.y - 1 === d.y && d.r > 0;
                    var isEastStone = stone.x === d.x + 1 && stone.y === d.y && d.r > 0;
                    var isSouthStone = stone.x === d.x && stone.y + 1 === d.y && d.r > 0;
                    var isWestStone = stone.x === d.x - 1 && stone.y === d.y && d.r > 0;
                    return isNorthStone || isEastStone || isSouthStone || isWestStone;
                });
                console.log("maxBlankCnt: ", maxBlankCnt);
                console.log("filteredStone.length: ", filteredStone.length);
                blankCnt += maxBlankCnt - filteredStone.length;
            });
            return blankCnt;
        };
        $scope.addStoneRandom = function() {
            for (var i = 0; i < Math.round(Math.random() * 30 + 20); i++) {
                var x = Math.round(Math.random() * 18) + 1;
                var y = Math.round(Math.random() * 18) + 1;
                var tmpArr = $scope.giboData.stones.filter(function(d) {return x == d.x && y == d.y });
                if (tmpArr.length == 0) {
                    $scope.giboData.stones.push({x: x, y: y, r: $scope.r, idxNo: $scope.giboData.stones.length, isShow: true});
                }
            }
        };
        $scope.removeStone = function() {
            $scope.giboData.stones.pop();
        };
        $scope.clearStone = function() {
            $scope.giboData.stones = [];
        };
        $scope.toggleStoneVisibility = function() {
            $scope.showStone = !$scope.showStone;
            if($scope.showStone) $scope.toggleStoneBtnClass = ['btn', 'btn-xs', 'btn-info'];
            else $scope.toggleStoneBtnClass = ['btn', 'btn-xs', 'btn-danger'];
        };
        $scope.squareRenderer = function(el, data) {
            var rect = el.selectAll('rect').data(data.squares);
            rect.enter()
                .append('rect')
                .attr({'x': 10 * $scope.dx, 'y': 10 * $scope.dy, 'width': 0, 'height': 0, 'filter': "url(#f4)"})
                .style('fill', function() {return 'rgb(' + parseInt(Math.random() * 255) + ',' + parseInt(Math.random() * 255) + ',' + parseInt(Math.random() * 255) + ')';})
                .transition()
                .duration(1000)
                .delay(function(d, i) {return i * 10;})
                .attr({'x': function(d) {return d.x * $scope.dx - d.size / 2;}, 'y': function(d) {return d.y * $scope.dy - d.size / 2;}, 'width': function(d) {return d.size;}, 'height': function(d) {return d.size;}});
            rect.exit()
                .transition()
                .duration(1000)
                .delay(function(d, i) {return i * 10;})
                .attr({'x': 10 * $scope.dx, 'y': 10 * $scope.dy, 'width': 0, 'height': 0})
                .remove();
            var text = el.selectAll("text").data(data.squares);
            var textColor = 'rgb(' + parseInt(Math.random() * 255) + ',' + parseInt(Math.random() * 255) + ',' + parseInt(Math.random() * 255) + ')';
            text.enter()
                .append('text')
                .text(function (d, i) {return i + 1;})
                .attr({"dx": 10 * $scope.dx, "dy": 10 * $scope.dy, "text-anchor": "middle", "alignment-baseline": "middle"})
                .style({"fill": function(d) {return textColor;}, "font-size": "0", "font-weight": "bold"})
                .transition()
                .duration(1000)
                .delay(function(d, i) {return i * 10;})
                .attr({"dx": function(d) {return d.x * $scope.dx;}, "dy": function(d) {return d.y * $scope.dy;}, "text-anchor": "middle", "alignment-baseline": "middle"})
                .style({"fill": function(d) {return textColor;}, "font-size": "40", "font-weight": "bold"});
            text.exit()
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
            $scope.squareData.squares = [];
        };
        $scope.toggleSquareVisibility = function() {
            $scope.showSquares = !$scope.showSquares;
            if($scope.showSquares) $scope.toggleSquaresBtnClass = ['btn', 'btn-xs', 'btn-info'];
            else $scope.toggleSquaresBtnClass = ['btn', 'btn-xs', 'btn-danger'];
        };
    }

    deagookCtrl.$inject = ['$scope'];

    return deagookCtrl;
});