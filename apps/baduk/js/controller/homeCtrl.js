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
        $scope.curIdx = 0;
        $scope.gab = 1;
        $scope.dx = 0;
        $scope.dy = 0;
        $scope.isShowNumber = true;

        var canvas = document.getElementById('puzzleCanvas');
        var context = canvas.getContext('2d');
        var imageObj = new Image();

        var $puzzleSvg = $("#puzzleSvg");
        var $progressBar = $(".progress-bar:first", "#progressBar");

        imageObj.src = '../../images/images.jpg';

        imageObj.onload = function() {
            //$puzzleSvg.empty();

            $scope.curIdx = $scope.maxCol * $scope.maxRow - 1;
            $scope.isHistoryStop = false;
            $scope.isShowNumber = true;
            $scope.imgDataArr = [];
            $scope.moveHistoryArr = [];

            var divWidth = $("#puzzleDiv").width();
            var nw = this.naturalWidth;
            var nh = this.naturalHeight;

            $scope.dx = Math.floor((divWidth) / $scope.maxCol);
            $scope.dy = Math.floor((divWidth) * (nh / nw) / $scope.maxRow);

            canvas.width = $scope.dx * $scope.maxCol + $scope.gab * ($scope.maxCol - 1);
            canvas.height = $scope.dy * $scope.maxRow + $scope.gab * ($scope.maxRow - 1);

            context.drawImage(imageObj, 0, 0, nw, nh, 0, 0, canvas.width, canvas.height);
            context.fillRect(($scope.maxCol - 1) * $scope.dx, ($scope.maxRow - 1) * $scope.dy, $scope.dx, $scope.dy);

            for (var row = 0; row < $scope.maxRow; row++) {
                for (var col = 0; col < $scope.maxCol; col++) {
                    var sx = col * $scope.dx;
                    var sy = row * $scope.dy;
                    $scope.imgDataArr.push({image: context.getImageData(sx, sy, $scope.dx, $scope.dy), image2: convertImgDataToBase64URL(context.getImageData(sx, sy, $scope.dx, $scope.dy), "image/png"), x: col, y: row, idx: $scope.imgDataArr.length});
                }
            }

            $scope.imgDataArr.forEach(function(v){
                console.log(convertImgDataToBase64URL(v.image, ""));
            });

            $puzzleSvg.get(0).setAttribute("viewBox", "0 0 " + ($scope.maxCol * $scope.dx + $scope.gab * ($scope.maxCol - 1)) + " " + ($scope.maxRow * $scope.dy + $scope.gab * ($scope.maxRow - 1)));
            drawData();
            setProgressBar();
            $scope.$apply();
        };

        $scope.puzzleRenderer = function(el, data) {
            var grp1 = el.selectAll("g").data(data);
            var img1 = grp1.selectAll("image");
            img1.on("click", function() {});
            img1.attr({"id": function (d) {return "G_" + d.idx;}, "preserveAspectRatio": "xMinYMin meet", "xlink:href": function (d) {return d.image2;}});
            img1.style({"width": $scope.dx + "px", "height": $scope.dy + "px"})
            var txt1 = grp1.selectAll("text");
            txt1.text(function (d) {return d.idx + 1;});
            txt1.attr({"dx": $scope.dx / 2, "dy": $scope.dy / 2});
            txt1.style({"font-size": "30px", "display": ($scope.isShowNumber ? "" : "none")});

            var grp2 = grp1.enter().append("g");
            grp2.attr({"transform": function(d) {return "translate(" + d.x * $scope.dx + "," + d.y * $scope.dy + ")";}});
            var img1 = grp2.append("image");
            img1.on("click", function() {});
            img1.attr({"id": function (d) {return "G_" + d.idx;}, "preserveAspectRatio": "xMinYMin meet", "xlink:href": function (d) {return d.image2;}});
            img1.style({"width": $scope.dx + "px", "height": $scope.dy + "px"})
            var txt1 = grp2.append("text");
            txt1.text(function (d) {return d.idx + 1;});
            txt1.attr({"dx": $scope.dx / 2, "dy": $scope.dy / 2});
            txt1.style({"font-size": "30px", "display": ($scope.isShowNumber ? "" : "none")});

            var grp3 = grp1.exit();
            grp3.remove();
        };

        function convertImgToBase64URL(url, callback, outputFormat){
            var img = new Image();
            img.crossOrigin = 'Anonymous';
            img.onload = function(){
                var canvas = document.createElement('CANVAS'),
                    ctx = canvas.getContext('2d'), dataURL;
                canvas.height = this.height;
                canvas.width = this.width;
                ctx.drawImage(this, 0, 0);
                dataURL = canvas.toDataURL(outputFormat);
                callback(dataURL);
                canvas = null;
            };
            img.src = url;
        }
        convertImgToBase64URL("../../images/images.jpg", function() {}, "image/png");

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

        function swapData(a, b) {
            var tmpData = {image: $scope.imgDataArr[a].image, idx: $scope.imgDataArr[a].idx};

            $scope.imgDataArr[a].image = $scope.imgDataArr[b].image;
            $scope.imgDataArr[a].idx = $scope.imgDataArr[b].idx;
            $scope.imgDataArr[b].image = tmpData.image;
            $scope.imgDataArr[b].idx = tmpData.idx;

            drawImage($scope.imgDataArr[a]);
            drawImage($scope.imgDataArr[b]);
        }

        function moveUp() {
            var y = Math.floor($scope.curIdx / $scope.maxCol);

            if (y > 0) {
                var targetIdx = $scope.curIdx - parseInt($scope.maxCol);
                swapData($scope.curIdx, targetIdx);
                $scope.curIdx = targetIdx;
                if (!$scope.isHistoryStop) {
                    $scope.moveHistoryArr.push(2);
                    $scope.$apply();
                }
                setProgressBar();
            }
        }

        function moveRight() {
            var x = $scope.curIdx % $scope.maxCol;

            if (x < $scope.maxCol - 1) {
                var targetIdx = $scope.curIdx + 1;
                swapData($scope.curIdx, targetIdx);
                $scope.curIdx = targetIdx;
                if (!$scope.isHistoryStop) {
                    $scope.moveHistoryArr.push(3);
                    $scope.$apply();
                }
                setProgressBar();
            }
        }

        function moveDown() {
            var y = Math.floor($scope.curIdx / $scope.maxCol);
            if (y < $scope.maxRow - 1) {
                var targetIdx = $scope.curIdx + parseInt($scope.maxCol);
                swapData($scope.curIdx, targetIdx);
                $scope.curIdx = targetIdx;
                if (!$scope.isHistoryStop) {
                    $scope.moveHistoryArr.push(0);
                    $scope.$apply();
                }
                setProgressBar();
            }
        }

        function moveLeft() {
            var x = $scope.curIdx % $scope.maxCol;

            if (x > 0) {
                var targetIdx = $scope.curIdx - 1;
                swapData($scope.curIdx, targetIdx);
                $scope.curIdx = targetIdx;
                if (!$scope.isHistoryStop) {
                    $scope.moveHistoryArr.push(1);
                    $scope.$apply();
                }
                setProgressBar();
            }
        }

        function drawData() {
            context.clearRect(0, 0, canvas.width, canvas.height);

            $scope.imgDataArr.forEach(function(v, i) {
                drawImage(v);
            });
        }

        function drawImage(data) {
            var sx = data.x * ($scope.dx + $scope.gab);
            var sy = data.y * ($scope.dy + $scope.gab);
            context.putImageData(data.image, sx, sy);
            if ($scope.isShowNumber && data.idx < ($scope.maxCol * $scope.maxRow) - 1) {
                context.font = Math.floor(Math.min($scope.dx, $scope.dy) / 5) + "px Arial";
                context.fillStyle = "white";
                context.textAlign = "center";
                context.textBaseline = "middle";
                context.fillText("" + (data.idx + 1), sx + $scope.dx / 2, sy + $scope.dy / 2);
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

        function getMousePos(evt) {
            var rect = canvas.getBoundingClientRect();
            return {
                x: evt.clientX - rect.left,
                y: evt.clientY - rect.top
            };
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

        /*
        $(window).resize(function(event) {
            clearInterval(timerId);
            $(imageObj).trigger("onload");
        });
        */

        $(canvas).mousedown(function(event) {
            var pos = getMousePos(event);
            var x = Math.floor(pos.x / $scope.dx);
            var y = Math.floor(pos.y / $scope.dy);
            var imgData = $scope.imgDataArr[$scope.curIdx];

            if (x < imgData.x) {
                for (var i = 0; i < imgData.x - x; i ++) moveLeft();
            }
            else {
                for (var i = 0; i < x - imgData.x; i ++) moveRight();
            }
            if (y < imgData.y) {
                for (var i = 0; i < imgData.y - y; i ++) moveUp();
            }
            else {
                for (var i = 0; i < y - imgData.y; i ++) moveDown();
            }
        });

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