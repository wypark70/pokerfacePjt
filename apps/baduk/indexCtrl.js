/**
 * Created by W.Y.Park on 2015-03-04.
 */
function indexCtrl($scope) {
    $scope.appName = 'Baduk';
    $scope.menus = [];
    $scope.menus.push({name: '대기실', url: '#/waitingRoom', class:''});
    $scope.menus.push({name: '대국실', url: '#/deagook', class:''});
    $scope.menus.push({name: '기보함', url: '#/gibo', class:''});

    $(function() {
        $("#mainContainer").show();
    });
}