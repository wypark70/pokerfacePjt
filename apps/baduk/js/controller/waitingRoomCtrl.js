/**
 * Created by W.Y.Park on 2015-03-02.
 */

'use strict';

define([], function () {
    function waitingRoomCtrl($scope) {
        $scope.message = "Waiting room !!!!";

        $("#cardDiv").load("../../images/Color_52_Faces_v.2.0.svg", function() {
            function hide() {
                $("#layer1 text").animate({opacity: 0}, 5000, function() {
                    $(this).css({opacity: 1});
                    hide();
                });
                $("#layer1 g").animate({opacity: 1}, 5000, function() {
                    $(this).css({opacity: 0});
                    hide();
                });
            }
            hide();
        });

        var $listGroupItem = $("ul.list-group>li.list-group-item");

        $listGroupItem.css("cursor", "pointer");
        $($listGroupItem.get(0)).css("background", "bisque");
        $listGroupItem.click(function() {
            var $iframe = $('<iframe width="633" height="355" src="' + $(this).data().src + '" frameborder="0" allowfullscreen></iframe>');
            $("div.embed-responsive").empty().append($iframe);

            $listGroupItem.css("background", "#fff");
            $(this).css("background", "bisque");
        });

        /*
        $('#video2').videoExtend({
        });
        */

        new jPlayerPlaylist({
            jPlayer: "#jquery_jplayer_1",
            cssSelectorAncestor: "#jp_container_1"
        }, [
            {
                title:"윤미래 - 너를 사랑해.mp3",
                mp3:"../../music/윤미래 - 너를 사랑해.mp3"
            },
            {
                title:"백지영 - 잊지 말아요.mp3",
                mp3:"../../music/백지영 - 잊지 말아요.mp3"
            },
            {
                title:"백지영 - 총맞은것처럼.mp3",
                mp3:"../../music/백지영 - 총맞은것처럼.mp3"
            },
        ], {
            swfPath: "../../../libs/jplayer/2.9.2/jplayer",
            supplied: "oga, mp3",
            wmode: "window",
            useStateClassSkin: true,
            autoBlur: false,
            smoothPlayBar: true,
            keyEnabled: true
        });
    };
    waitingRoomCtrl.$inject = ['$scope'];
    return waitingRoomCtrl;
});