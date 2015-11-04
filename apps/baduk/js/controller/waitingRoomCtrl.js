/**
 * Created by W.Y.Park on 2015-03-02.
 */

'use strict';

define([], function () {
    function waitingRoomCtrl($scope) {
        $scope.message = "Waiting room !!!!";
        new jPlayerPlaylist({
            jPlayer: "#jquery_jplayer_1",
            cssSelectorAncestor: "#jp_container_1"
        }, [
            {
                title:"001 yun mi re",
                mp3:"../../music/001.mp3"
            },
            {
                title:"001 yun mi re",
                mp3:"../../music/001.mp3"
            },
            {
                title:"001 yun mi re",
                mp3:"../../music/001.mp3"
            },
            {
                title:"001 yun mi re",
                mp3:"../../music/001.mp3"
            },
            {
                title:"001 yun mi re",
                mp3:"../../music/001.mp3"
            },
            {
                title:"001 yun mi re",
                mp3:"../../music/001.mp3"
            },
            {
                title:"001 yun mi re",
                mp3:"../../music/001.mp3"
            },
            {
                title:"001 yun mi re",
                mp3:"../../music/001.mp3"
            },
            {
                title:"001 yun mi re",
                mp3:"../../music/001.mp3"
            },
            {
                title:"001 yun mi re",
                mp3:"../../music/001.mp3"
            }
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