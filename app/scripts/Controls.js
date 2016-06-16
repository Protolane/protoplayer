(function(angular) {
  var app = angular.module('PlayerControls', []);

  app.filter('secondsToDateTime', [function() {
    return function(seconds) {
        return new Date(1970, 0, 1).setSeconds(seconds);
    };
  }]);

  app.directive('mpMediaControls', ['$interval', 'Player', function($interval, Player) {
    return {
      templateUrl: './views/player/media-controls.tmpl.html',
      link: function($scope, el) {
        el[0].classList.add('layout-align-space-between-center',  'layout-row');

        var seekTimer = null;

        $scope.seekPosition = 0;
        $scope.volume = Player.getVolume() * 100;

        $scope.getPlayPauseIcon = function() {
          if (Player.isPaused()) {
            return './img/controls/play_arrow.svg';
          } else {
            return './img/controls/pause.svg';
          }
        }

        $scope.getDuration = function() {
          return Player.getDuration();
        };

        $scope.getCurrentTime = function() {
          return Player.getCurrentTime();
        };

        $scope.playPause = function() {
          Player.playPause();
        };

        var fullscreen = false;
        $scope.fullscreen = function() {
          if (fullscreen) {
            document.webkitExitFullscreen();
            fullscreen = false;
          } else {
            document.body.webkitRequestFullScreen();
            fullscreen = true;
          }
        };

        $scope.mute = function() {
          if (Player.isMuted()) {
            Player.setMuted(false);
          } else {
            Player.setMuted(true);
          }
        };

        $scope.getVolumeIcon = function() {
          if (Player.isMuted()) {
            return './img/controls/volume_off.svg'
          } else {
            return './img/controls/volume_down.svg'
          }
        }

        $scope.$on('mp-pause', function(event, data) {
          $interval.cancel(seekTimer);
        });

        $scope.$on('mp-play', function(event, data) {
          $interval.cancel(seekTimer);
          seekTimer = $interval(function() {
            stopWatchingSeekingBar();
            $scope.seekPosition = ($scope.getCurrentTime() / $scope.getDuration()) * 100;
            watchSeekingBar();
          }, 250);
        });

        var sw = null;
        var watchSeekingBar = function() {
          sw = $scope.$watch('seekPosition', function(newValue, oldValue) {
            if (newValue !== oldValue) {
              Player.setCurrentTime(Player.getDuration() * (newValue / 100));
            }
          });
        };

        var stopWatchingSeekingBar = function() {
          if (sw) {
            sw();
          }
        };

        $scope.$watch('volume', function(newValue, oldValue) {
          if (newValue !== oldValue) {
            if (newValue === 0) {
              Player.setMuted(true);
            } else {
              Player.setVolume(newValue / 100);
              Player.setMuted(false);
            }
          }
        });

      }
    }
  }]);

})(window.angular);
