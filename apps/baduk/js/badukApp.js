/**
 * Created by W.Y.Park on 2015-03-02.
 */

//requireJS 모듈 선언 - [myApp 앵귤러 모듈]
define(
    [
        'apps/baduk/js/config',
        'apps/baduk/js/controller/homeCtrl',
        'apps/baduk/js/controller/waitingRoomCtrl',
        'apps/baduk/js/controller/deagookCtrl',
        'apps/baduk/js/controller/giboCtrl'
    ],

    /*
     이 부분도 주의깊게 살펴봐야한다.
     위의 디펜던시들이 모두 로드된 뒤에 아래의 콜백이 실행된다.
     디펜던시들이 리턴하는 객체들을 콜백함수의 파라메터로 받게 되는데,
     자세히보면 route-config와 같이 snake case로 된 파일명이,
     파라메터로 받을 때는 routeConfig와 같이 camel case로 바뀌는 것을 볼 수 있다.
     */

    //디펜던시 로드뒤 콜백함수
    function (config, homeCtrl, waitingRoomCtrl, deagookCtrl, giboCtrl) {
        //위의 디펜던시를 가져와서 콜백을 수행하게 되는데,
        //리턴하는 내용이 실제 사용되는 부분이겠지?
        //여기서는 badukApp이라는 앵귤러 모듈을 리턴한다.

        //모듈 선언
        var app = angular.module('badukApp', ['d3']);

        //공통 컨트롤러 설정 - 모든 컨트롤러에서 공통적으로 사용하는 부분들 선언
        app.config(config);
        app.controller('homeCtrl', homeCtrl);
        app.controller('waitingRoomCtrl', waitingRoomCtrl);
        app.controller('deagookCtrl', deagookCtrl);
        app.controller('giboCtrl', giboCtrl);

        return app;
    }
);
