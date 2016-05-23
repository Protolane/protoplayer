(function(angular) {
  var app = angular.module('Multiplayer', ['ngMaterial']);

  app.controller('Test', ['$scope', function($scope) {
      angular.extend($scope, {
        node: process.versions.node,
        chrome: process.versions.chrome,
        electron: process.versions.elentron,
        angular: angular.version.full
      });

      var w = window,
        d = document,
        e = d.documentElement,
        g = d.getElementsByTagName('body')[0],
        x = w.innerWidth || e.clientWidth || g.clientWidth,
        y = w.innerHeight|| e.clientHeight|| g.clientHeight;

      $scope.$watchCollection(function() {
        return [x, y];
      }, function(values) {
        $scope.x = values[0];
        $scope.y = values[1];
      })
  }]);
})(angular)
