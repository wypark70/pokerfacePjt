/**
 * Created by W.Y.Park on 2015-03-02.
 */

'use strict';

define([], function() {
    function deagookCtrl($scope) {
        $scope.isShowGibo = true;
        $scope.toggleGiboBtnClass = ["btn", "btn-xs", "btn-info"];

        $scope.width = 2000;
        $scope.height = 2000;
        $scope.dx = $scope.width / 20;
        $scope.dy = $scope.height / 20;
        $scope.startX = $scope.dx;
        $scope.startY = $scope.dy;
        $scope.endX = $scope.width - $scope.dx;
        $scope.endY = $scope.height - $scope.dy;
        $scope.r = Math.min($scope.dx, $scope.dy) / 2 - 5;

        $scope.paeArr = [];

        $scope.isShowNumber = true;
        $scope.toggleNumberBtnClass = ["btn", "btn-xs", "btn-info"];

        $scope.panData = {lines: [], dotCircles: [], panCircles: []};
        $scope.giboData = {stones: []};

        $scope.blackDieStones = [];
        $scope.whiteDieStones = [];

        $scope.panRenderer = function(el, data) {
            var line = el.selectAll("line").data(data.lines);
            line.enter()
                .append("line")
                .attr({"x1": function(d) {return d.x1;}, "y1": function(d) {return d.y1;}, "x2": function(d) {return d.x2;}, "y2": function(d) {return d.y2;}});
            var cir1 = el.selectAll("circle.dotCircle").data(data.dotCircles);
            cir1.enter()
                .append("circle")
                .attr({"class": "dotCircle", "cx": 10 * $scope.dx, "cy": 10 * $scope.dy, "r": 0})
                .transition()
                .duration(1000)
                .attr({"cx": function(d) {return d.x * $scope.dx;}, "cy": function(d) {return d.y * $scope.dy;}, "r": function(d) {return d.r;}});
            var cir2 = el.selectAll("circle.panCircle").data(data.panCircles);
            cir2.enter()
                .append("circle")
                .on("click", $scope.addStone)
                .attr({"class": "panCircle", "cx": 10 * $scope.dx, "cy": 10 * $scope.dy, "r": 0})
                .transition()
                .duration(1000)
                .attr({"cx": function(d) {return d.x * $scope.dx;}, "cy": function(d) {return d.y * $scope.dy;}, "r": function(d) {return d.r;}});
        };
        $scope.giboRenderer = function(el, data) {
            var grp1 = el.selectAll("g").data(data.stones);
            grp1.style({"display": function(d) {return d.isShow ? "" : "none";}});

            var grp2 = grp1.enter().append("g");
            grp2.attr({"transform": function(d) {return "translate(" + d.x * $scope.dx + "," + d.y * $scope.dy + ")";}});

            var cir1 = grp2.append("circle");
            cir1.on("click", $scope.logLinkedStone);
            cir1.attr({"class": function(d) {return getStoneClass(d);}, "cx": 0, "cy": 0, "r": function(d) {return d.r;}});

            var txt1 = grp2.append("text");
            txt1.on("click", $scope.logLinkedStone);
            txt1.text(function (d) {return d.idxNo + 1;});
            txt1.attr({"class": function(d) {return getTextClass(d);}, "dx": 0, "dy": 0});
            txt1.attr({"font-size": "35", "display": ($scope.isShowNumber ? "block" : "none")});

            var grp3 = grp1.exit();
            grp3.remove();
        };
        $scope.addStone = function() {
            var data = d3.select(this).data()[0];
            var newStone = {x: data.x, y: data.y, r: data.r, idxNo: $scope.giboData.stones.length, isShow: true};
            addStonesData(newStone);
            $scope.$apply();
            $scope.setPanCircleFill();
        };
        $scope.setPanCircleFill = function() {
            var $panCircle = $("#panGroup > circle.panCircle");
            if ($scope.giboData.stones.length % 2 == 0) {
                $panCircle.css("fill", "url('#gradient_3D_black')");
            }
            else {
                $panCircle.css("fill", "url('#gradient_3D_white')");
            }
        };
        $scope.logLinkedStone = function() {
            var data = d3.select(this).data()[0];
            console.log(findLinkedStone(data));
        };
        $scope.addStoneRandom = function() {
            /*
            for (var i = 0; i < 100; i++) {
                if ($scope.giboData.stones.length > 300) break;
                var x = Math.round(Math.random() * 18) + 1;
                var y = Math.round(Math.random() * 18) + 1;
                var idxNo = $scope.giboData.stones.length;
                var isShow = true;
                var tmpArr = $scope.giboData.stones.filter(function(d) {return d.x === x && d.y === y && d.isShow});
                if (tmpArr.length == 0) {
                    addStonesData({x: x, y: y, r: $scope.r, idxNo: idxNo, isShow: isShow});
                }
            }
            */

            function getRandomSton() {
                var x = Math.round(Math.random() * 18) + 1;
                var y = Math.round(Math.random() * 18) + 1;
                var tmpArr = $scope.giboData.stones.filter(function(d) {return d.x === x && d.y === y && d.isShow});

                if (tmpArr.length == 0) {
                    return  {x: x, y: y, r: $scope.r, idxNo: $scope.giboData.stones.length, isShow: true};
                }
                else {
                    getRandomSton();
                }
            }

            var timerId;
            timerId = setInterval(function() {
                var stone = getRandomSton();
                if ($scope.giboData.stones.length > 400) {
                    clearInterval(timerId);
                }
                else {
                    if (stone != undefined) {
                        addStonesData(stone);
                        $scope.$apply();
                    }
                }
            }, 100);
        };
        $scope.removeStone = function() {
            if ($scope.giboData.stones.length > 0) {
                var tmpStone = $scope.giboData.stones[$scope.giboData.stones.length - 1];
                tmpStone.dieStoneArr.forEach(function (stone) {
                    stone.r = $scope.r;
                    stone.isShow = true;
                });
                $scope.paeArr = [].concat(tmpStone.paeArr);
                $scope.giboData.stones.pop();
                $scope.setPanCircleFill();
            }
        };
        $scope.clearStone = function() {
            $scope.giboData.stones = [];
            $scope.blackDieStones = [];
            $scope.whiteDieStones = [];
        };
        $scope.toggleGiboVisibility = function() {
            $scope.isShowGibo = !$scope.isShowGibo;
            if($scope.isShowGibo) $scope.toggleGiboBtnClass = ["btn", "btn-xs", "btn-info"];
            else $scope.toggleGiboBtnClass = ["btn", "btn-xs", "btn-danger"];
        };
        $scope.toggleNumberVisibility = function() {
            $scope.isShowNumber = !$scope.isShowNumber;
            if ($scope.isShowNumber) {
                $scope.toggleNumberBtnClass = ["btn", "btn-xs", "btn-info"];
                $("text", "#giboGroup").show();
            }
            else {
                $scope.toggleNumberBtnClass = ["btn", "btn-xs", "btn-danger"];
                $("text", "#giboGroup").hide();
            }
        };
        function getIsBlackStone(stone) {
            return stone.idxNo % 2 == 0;
        }
        function getStoneClass(stone) {
            return getIsBlackStone(stone) ? "blackStone" : "whiteStone";
        }
        function getStoneStyle(stone) {
            return getIsBlackStone(stone) ? {fill: "url('#gradient_3D_black')", opacity: 1} : {fill: "url('#gradient_3D_white')", opacity: 1};
        }
        function getTextClass(stone) {
            return getIsBlackStone(stone) ? "blackStoneText" : "whiteStoneText";
        }
        function findLinkedStone(baseStone) {
            var linkedStoneArr = [];
            function getLinkedStone(baseStone) {
                linkedStoneArr.push(baseStone);
                var isBlackBaseStone = getIsBlackStone(baseStone);
                var filteredStone = $scope.giboData.stones.filter(function (d) {
                    var isBlackStone = getIsBlackStone(d);
                    var isSameStoneColor = (isBlackBaseStone && isBlackStone) || (!isBlackBaseStone && !isBlackStone);
                    var isNorthStone = baseStone.x === d.x && baseStone.y - 1 === d.y && isSameStoneColor && d.isShow;
                    var isEastStone = baseStone.x === d.x + 1 && baseStone.y === d.y && isSameStoneColor && d.isShow;
                    var isSouthStone = baseStone.x === d.x && baseStone.y + 1 === d.y && isSameStoneColor && d.isShow;
                    var isWestStone = baseStone.x === d.x - 1 && baseStone.y === d.y && isSameStoneColor && d.isShow;
                    return isNorthStone || isEastStone || isSouthStone || isWestStone;
                });
                if (filteredStone.length > 0) {
                    filteredStone.forEach(function (stone) {
                        var tmpStoneArr = linkedStoneArr.filter(function (d) {
                            return stone.x === d.x && stone.y === d.y && getIsBlackStone(stone) === getIsBlackStone(d);
                        });
                        if (!(tmpStoneArr.length > 0)) {
                            getLinkedStone(stone);
                        }
                    });
                }
            }
            getLinkedStone(baseStone);
            return linkedStoneArr;
        }
        function hideStones(baseStone) {
            var linkedStoneArr = findLinkedStone(baseStone);
            var blankCnt = getLinkedBlankCnt(linkedStoneArr);
            var dieStoneArr = [];
            var isBlackBaseStone = getIsBlackStone(baseStone);
            var filteredStone = $scope.giboData.stones.filter(function(d) {
                var isBlackStone = getIsBlackStone(d);
                var isSameStoneColor = (isBlackBaseStone && isBlackStone) || (!isBlackBaseStone && !isBlackStone);
                var isNorthStone = baseStone.x === d.x && baseStone.y - 1 === d.y && !isSameStoneColor && d.isShow;
                var isEastStone = baseStone.x === d.x + 1 && baseStone.y === d.y && !isSameStoneColor && d.isShow;
                var isSouthStone = baseStone.x === d.x && baseStone.y + 1 === d.y && !isSameStoneColor && d.isShow;
                var isWestStone = baseStone.x === d.x - 1 && baseStone.y === d.y && !isSameStoneColor && d.isShow;
                return isNorthStone || isEastStone || isSouthStone || isWestStone;
            });
            if (filteredStone.length > 0) {
                filteredStone.forEach(function(stone) {
                    var tmpLinkedStoneArr = findLinkedStone(stone);
                    var tmpBlankCnt = getLinkedBlankCnt(tmpLinkedStoneArr);
                    if (tmpLinkedStoneArr.length > 0 && tmpBlankCnt < 1) {
                        tmpLinkedStoneArr.forEach(function(linkedStone) {
                            linkedStone.isShow = false;
                            dieStoneArr.push(linkedStone);
                        });
                    }
                });
            }
            baseStone["dieStoneArr"] = [].concat(dieStoneArr);
            baseStone["paeArr"] = [].concat($scope.paeArr);
            if (linkedStoneArr.length == 1 && blankCnt == 0 && dieStoneArr.length == 1) {
                var dieStone = {};
                $.extend(dieStone, dieStoneArr[0]);
                var tmpPaeArr = $scope.paeArr.filter(function(d) {return d.x === dieStone.x && d.y === dieStone.y});
                if (tmpPaeArr.length == 0) {
                    dieStone.idxNo = baseStone.idxNo;
                    $scope.paeArr.push(dieStone);
                }
            }
        }
        function getLinkedBlankCnt(linkedStoneArr) {
            var blankCnt = 0;
            linkedStoneArr.forEach(function(stone) {
                var isLeftLine = stone.x < 2;
                var isRightLine = stone.x > 18;
                var isTopLine = stone.y < 2;
                var isBottonLine = stone.y > 18;
                var isLeftTop = stone.x < 2 && stone.y < 2;
                var isRightTop = stone.x > 18 && stone.y < 2;
                var isLeftBotton = stone.x < 2 && stone.y > 18;
                var isRightBotton = stone.x > 18 && stone.y > 18;
                var maxBlankCnt = (isLeftTop || isRightTop || isLeftBotton || isRightBotton) ? 2 : ((isLeftLine || isRightLine || isTopLine || isBottonLine) ? 3 : 4);
                console.log("isRightLine: " + isRightLine);
                var filteredStone = $scope.giboData.stones.filter(function(d) {
                    var isNorthStone = stone.x === d.x && stone.y - 1 === d.y && d.isShow;
                    var isEastStone = stone.x === d.x + 1 && stone.y === d.y && d.isShow;
                    var isSouthStone = stone.x === d.x && stone.y + 1 === d.y && d.isShow;
                    var isWestStone = stone.x === d.x - 1 && stone.y === d.y && d.isShow;
                    return isNorthStone || isEastStone || isSouthStone || isWestStone;
                });
                console.log("filteredStone.length: " + filteredStone.length);
                blankCnt += maxBlankCnt - filteredStone.length;
            });
            return blankCnt;
        }
        function addStonesData(stone) {
            var paeArr = $scope.paeArr.filter(function(d) {return d.x === stone.x && d.y === stone.y});
            if (paeArr.length > 0) {
                var paeData = paeArr[0];
                if (paeData.idxNo + 1 === stone.idxNo) {
                    return false;
                }
                else {
                    $scope.paeArr.splice($scope.paeArr.indexOf(paeData), 1);
                }
            }

            $scope.giboData.stones.push(stone);
            hideStones(stone);
            var linkedStone = findLinkedStone(stone);
            var linkedBlankCnt = getLinkedBlankCnt(linkedStone);
            if (linkedBlankCnt == 0) {
                $scope.giboData.stones.pop();
            }
            $scope.blackDieStones = $scope.giboData.stones.filter(function(d) {return getIsBlackStone(d) && !d.isShow});
            $scope.whiteDieStones = $scope.giboData.stones.filter(function(d) {return !getIsBlackStone(d) && !d.isShow});
        }
        function initPanData() {
            d3.range($scope.startX, $scope.endX + 1, $scope.dx).forEach(function(d) {
                $scope.panData.lines.push({x1: d, y1: $scope.startY, x2: d, y2: $scope.endY});
            });
            d3.range($scope.startY, $scope.endY + 1, $scope.dy).forEach(function(d) {
                $scope.panData.lines.push({x1: $scope.startX, y1: d, x2: $scope.endX, y2: d});
            });
            var dotArr = [
                {x:4, y:4}, {x:4, y:10}, {x:4, y:16},
                {x:10, y:4}, {x:10, y:10}, {x:10, y:16},
                {x:16, y:4}, {x:16, y:10}, {x:16, y:16}
            ];
            dotArr.forEach(function(d) {
                $scope.panData.dotCircles.push({x: d.x, y: d.y, r: 7});
            });
            for(var x = 1; x < 20; x++) {
                for(var y = 1; y < 20; y++) {
                    $scope.panData.panCircles.push({x: x, y: y, r: $scope.r});
                }
            }
            d3.shuffle($scope.panData.panCircles);
        }
        initPanData();
    }

    //deagookCtrl.$inject = ["$scope"];

    return deagookCtrl;
});