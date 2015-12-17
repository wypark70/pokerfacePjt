/**
 * Created by W.Y.Park on 2015-03-02.
 */

'use strict';

define([], function () {
    function homeCtrl($scope) {
        $scope.imgDataArr = [];
        $scope.moveHistoryArr = [];
        $scope.isHistoryStop = false;
        $scope.maxCol = 5;
        $scope.maxRow = 5;
        $scope.blankIdx = 0;
        $scope.gab = 1;
        $scope.dx = 0;
        $scope.dy = 0;
        $scope.isShowNumber = true;
        $scope.fontSize = 18;

        var imageObj = new Image();
        var $puzzleSvg = $("#puzzleSvg");
        var $puzzleGroup = $("#puzzleGroup");
        var $progressBar = $(".progress-bar:first", "#progressBar");
        var canvas = document.createElement("canvas");
        var context = canvas.getContext('2d');

        imageObj.src = '../../images/images.jpg';

        imageObj.onload = function() {
            $scope.blankIdx = $scope.maxCol * $scope.maxRow - 1;
            $scope.blankData = {x: $scope.maxCol - 1, y: $scope.maxRow - 1};
            $scope.isHistoryStop = false;
            $scope.isShowNumber = true;
            $scope.imgDataArr = [];
            $scope.moveHistoryArr = [];

            $scope.dx = Math.floor(this.naturalWidth / $scope.maxCol);
            $scope.dy = Math.floor(this.naturalHeight / $scope.maxRow);
            $scope.fontSize = Math.floor(Math.min($scope.dx, $scope.dy) / 3);

            canvas.width = this.naturalWidth;
            canvas.height = this.naturalHeight;
            context.drawImage(imageObj, 0, 0, this.naturalWidth, this.naturalHeight, 0, 0, canvas.width, canvas.height);
            context.fillRect(($scope.maxCol - 1) * $scope.dx, ($scope.maxRow - 1) * $scope.dy, $scope.dx, $scope.dy);

            for (var row = 0; row < $scope.maxRow; row++) {
                for (var col = 0; col < $scope.maxCol; col++) {
                    var sx = col * $scope.dx;
                    var sy = row * $scope.dy;
                    $scope.imgDataArr.push({image: convertImgDataToBase64URL(context.getImageData(sx, sy, $scope.dx, $scope.dy), "image/png"), x: col, y: row, idx: $scope.imgDataArr.length});
                }
            }


            $puzzleSvg.get(0).setAttribute("viewBox", "0 0 " + ($scope.maxCol * $scope.dx + $scope.gab * ($scope.maxCol - 1)) + " " + ($scope.maxRow * $scope.dy + $scope.gab * ($scope.maxRow - 1)));
            $puzzleGroup.empty();
            setProgressBar();
            $scope.$apply();
        };

        $scope.puzzleRenderer = function(el, data) {
            //modify
            var grp1 = el.selectAll("g").data(data);
            grp1.attr({"data-x": function(d) {return d.x;}, "data-y": function(d) {return d.y;}});
            grp1.transition().duration(1).attr({"transform": function(d) {return "translate(" + (d.x * $scope.dx + d.x * $scope.gab) + "," + (d.y * $scope.dy + d.y * $scope.gab) + ")";}});

            //add
            var grp2 = grp1.enter().append("g");
            grp2.attr({"transform": function(d) {return "translate(" + (d.x * $scope.dx + d.x * $scope.gab) + "," + (d.y * $scope.dy + d.y * $scope.gab) + ")";}});
            grp2.attr({"data-x": function(d) {return d.x;}, "data-y": function(d) {return d.y;}});
            var img2 = grp2.append("image");
            img2.on("click", onClickImage);
            img2.attr({"id": function (d) {return "G_" + d.idx;}, "preserveAspectRatio": "xMinYMin meet", "xlink:href": function (d) {return d.image;}});
            img2.style({"width": $scope.dx + "px", "height": $scope.dy + "px"});
            var txt2 = grp2.append("text");
            txt2.on("click", onClickImage);
            txt2.text(function (d) {return d.idx + 1;});
            txt2.attr({"dx": $scope.dx / 2, "dy": $scope.dy / 2});
            txt2.style({"font-size": $scope.fontSize + "px", "display": ($scope.isShowNumber ? "" : "none")});

            //remove
            var grp3 = grp1.exit();
            grp3.remove();
        };

        function convertImgDataToBase64URL(imageData, outputFormat){
            var canvas = document.createElement('CANVAS');
            var ctx = canvas.getContext('2d');
            var dataURL;
            canvas.height = imageData.height;
            canvas.width = imageData.width;
            ctx.putImageData(imageData, 0, 0);
            dataURL = canvas.toDataURL(outputFormat);
            return dataURL;
        }

        function swapData(blankData, targetData) {
            var tmpData = {x: blankData.x, y: blankData.y};

            blankData.x = targetData.x;
            blankData.y = targetData.y;
            targetData.x = tmpData.x;
            targetData.y = tmpData.y;
        }

        function getTargetIndex(x, y) {
            return $scope.imgDataArr.indexOf($scope.imgDataArr.filter(function(d) {return d.x === x && d.y === y})[0]);
        }


        function moveUp() {
            var blankData = $scope.imgDataArr[$scope.blankIdx];
            if (blankData.y > 0) {
                var targetIdx = getTargetIndex(blankData.x, blankData.y - 1);
                var targetData = $scope.imgDataArr[targetIdx];
                swapData(blankData, targetData);
                if (!$scope.isHistoryStop) {
                    $scope.moveHistoryArr.push(2);
                    $scope.$apply();
                }
                setProgressBar();
            }
        }

        function moveRight() {
            var blankData = $scope.imgDataArr[$scope.blankIdx];

            if (blankData.x < $scope.maxCol - 1) {
                var targetIdx = getTargetIndex(blankData.x + 1, blankData.y);
                var targetData = $scope.imgDataArr[targetIdx];
                swapData(blankData, targetData);
                if (!$scope.isHistoryStop) {
                    $scope.moveHistoryArr.push(3);
                    $scope.$apply();
                }
                setProgressBar();
            }
        }

        function moveDown() {
            var blankData = $scope.imgDataArr[$scope.blankIdx];
            if (blankData.y < $scope.maxRow - 1) {
                var targetIdx = getTargetIndex(blankData.x, blankData.y + 1);
                var targetData = $scope.imgDataArr[targetIdx];
                swapData(blankData, targetData);
                if (!$scope.isHistoryStop) {
                    $scope.moveHistoryArr.push(0);
                    $scope.$apply();
                }
                setProgressBar();
            }
        }

        function moveLeft() {
            var blankData = $scope.imgDataArr[$scope.blankIdx];
            if (blankData.x > 0) {
                var targetIdx = getTargetIndex(blankData.x - 1, blankData.y);
                var targetData = $scope.imgDataArr[targetIdx];
                swapData(blankData, targetData);
                if (!$scope.isHistoryStop) {
                    $scope.moveHistoryArr.push(1);
                    $scope.$apply();
                }
                setProgressBar();
            }
        }

        function moveByIdx(m) {
            if (m == 0) {
                moveUp();
            }
            else if (m == 1) {
                moveRight();
            }
            else if (m == 2) {
                moveDown();
            }
            else if (m == 3) {
                moveLeft();
            }
        }

        function getProgress() {
            var totalCnt = $scope.imgDataArr.length;
            var completCnt = $scope.imgDataArr.filter(function(d) {return d.idx == (d.x + d.y * $scope.maxCol)}).length;
            return Math.floor(completCnt / totalCnt * 100);
        }

        function setProgressBar() {
            var progress = getProgress();
            $progressBar.css("width", progress + "%");
            $progressBar.empty().append(progress + "% Complete (success)");
        }

        var timerId;

        $("#mixBth").click(function () {
            clearInterval(timerId);
            $scope.isHistoryStop = false;
            timerId = setInterval(function() {
                moveByIdx(Math.floor(Math.random() * 4));
            }, 100);
        });

        $("#mixBth2").click(function () {
            clearInterval(timerId);
            $scope.isHistoryStop = false;
            for (var i = 0; i < 500; i ++) {
                moveByIdx(Math.floor(Math.random() * 4));
            }
        });

        $("#solveBth").click(function () {
            clearInterval(timerId);
            $scope.isHistoryStop = true;
            timerId = setInterval(function() {
                if ($scope.moveHistoryArr.length > 0) {
                    moveByIdx($scope.moveHistoryArr.pop());
                    $scope.$apply();
                }
                else {
                    clearInterval(timerId);
                    $scope.isHistoryStop = false;
                }
            }, 100);
        });

        $("#stopBth").click(function () {
            clearInterval(timerId);
            $scope.isHistoryStop = false;
        });

        $("img.img-thumbnail").click(function() {
            clearInterval(timerId);
            context.clearRect(0, 0, canvas.width, canvas.height);
            imageObj.src = this.src;
        });

        $("#maxCol").change(function() {
            clearInterval(timerId);
            $scope.maxCol = parseInt($(this).val());
            $(imageObj).trigger("onload");
        });

        $("#maxRow").change(function() {
            clearInterval(timerId);
            $scope.maxRow = parseInt($(this).val());
            $(imageObj).trigger("onload");
        });

        function onClickImage() {
            var clickData = d3.select(this).data()[0];
            var blankData = {x: $scope.imgDataArr[$scope.blankIdx].x, y: $scope.imgDataArr[$scope.blankIdx].y};

            if (clickData.y === blankData.y) {
                if (clickData.x < blankData.x) {
                    for (var i = 0; i < blankData.x - clickData.x; i ++) moveLeft();
                }
                else {
                    for (var i = 0; i < clickData.x - blankData.x; i ++) moveRight();
                }
            }
            if (clickData.x === blankData.x) {
                if (clickData.y < blankData.y) {
                    for (var i = 0; i < blankData.y - clickData.y; i ++) moveUp();
                }
                else {
                    for (var i = 0; i < clickData.y - blankData.y; i ++) moveDown();
                }
            }
        }

        $(window).keydown(function(event) {
            if (event.keyCode > 36 && event.keyCode < 41) {
                event.preventDefault();
                event.stopPropagation();
                switch (event.keyCode) {
                    case 37: // Left
                        moveRight();
                        break;
                    case 38: // Up
                        moveDown();
                        break;
                    case 39: // Right
                        moveLeft();
                        break;
                    case 40: // Down
                        moveUp();
                        break;
                }
            }
        });
    };

    homeCtrl.$inject = ['$scope'];
    return homeCtrl;
});