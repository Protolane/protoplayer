(function(angular) {
  var app = angular.module('Multiplayer', ['ngMaterial']);

  app.service('Player', function() {
    var player = document.createElement('video');
    var source = document.createElement('source');

    player.appendChild(source);

    return {
      getPlayer: function() {
        return player;
      },

      setSource: function(src) {
        source.src = src;
      }
    }
  })

  app.directive('mpPlayer', ['Player', function(Player) {
    return {
      templateUrl: './views/player/player.tmpl.html',
      transclude: true,
      scope: {
        src: '@'
      },
      link: function($scope, el) {
        Player.setSource($scope.src);
        el[0].appendChild(Player.getPlayer());
      }
    }
  }]);

  app.directive('mpControls', ['Player', function(Player) {
    return {
      templateUrl: './views/player/controls.tmpl.html',
      link: function($scope, el) {
        el[0].classList.add('layout-align-space-between-center',  'layout-row');

        $scope.playPause = function() {
          var player = Player.getPlayer();

          if (player.paused) {
            player.play();
          } else {
            player.pause();
          }
        };
      }
    }
  }])

})(angular)
