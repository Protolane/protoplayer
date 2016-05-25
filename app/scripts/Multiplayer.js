(function(angular) {
  var app = angular.module('Multiplayer', ['ngMaterial']);



  app.service('Player', ['$rootScope', function($rootScope) {
    var player = document.createElement('video');
    var source = document.createElement('source');

    var wrapEvent = function(name) {
      player['on' + name] = function(event) {
        $rootScope.$apply(function() {
          $rootScope.$broadcast('mp-' + name, event);
        });
      };
    };

    player.appendChild(source);

    wrapEvent('abort');
    wrapEvent('canplay');
    wrapEvent('canplaythrough');
    wrapEvent('emptied');
    wrapEvent('ended');
    wrapEvent('error');
    wrapEvent('loadeddata');
    wrapEvent('loadedmetadata');
    wrapEvent('loadstart');
    wrapEvent('pause');
    wrapEvent('click');
    wrapEvent('play');
    wrapEvent('playing');
    wrapEvent('progress');
    wrapEvent('ratechange');
    wrapEvent('seeked');
    wrapEvent('seeking');
    wrapEvent('stalled');
    wrapEvent('suspend');
    wrapEvent('timeupdate');
    wrapEvent('volumechange');
    wrapEvent('waiting');

    var Player = {
      getPlayer: function() {
        return player;
      },

      getSource: function() {
        return Player.getPlayer().src;
      },

      setSource: function(src) {
        source.src = src;
        Player.getPlayer().load();
      },

      play: function() {
        Player.getPlayer().play();
      },

      pause: function() {
        Player.getPlayer().pause();
      },

      playPause: function() {
        if (Player.isPaused()) {
          Player.play();
        } else {
          Player.pause();
        }
      },

      getAudioTracks: function() {
        return Player.getPlayer().audioTracks;
      },

      isAutoplay: function() {
        return Player.getPlayer().autoplay;
      },

      setAutoplay: function(autoplay) {
        Player.getPlayer().autoplay = autoplay;
      },

      getBuffered: function() {
        return Player.getPlayer().buffered;
      },

      getCurrentSrc: function() {
        return Player.getPlayer().currentSrc;
      },

      getCurrentTime: function() {
        return Player.getPlayer().currentTime;
      },

      setCurrentTime: function(currentTime) {
        Player.getPlayer().currentTime = currentTime;
      },

      isDefaultMuted: function() {
        return Player.getPlayer().defaultMuted;
      },

      setDefaultMuted: function(defaultMuted) {
        Player.getPlayer().defaultMuted = defaultMuted;
      },

      getDefaultPlaybackRate: function() {
        return Player.getPlayer().defaultPlaybackRate;
      },

      setDefaultPlaybackRate: function(defaultPlaybackRate) {
        Player.getPlayer().defaultPlaybackRate = defaultPlaybackRate;
      },

      getDuration: function() {
        return Player.getPlayer().duration;
      },

      isEnded: function() {
        return Player.getPlayer().ended;
      },

      getError: function() {
        return Player.getPlayer().error;
      },

      isLoop: function() {
        return Player.getPlayer().loop;
      },

      setLoop: function(loop) {
        Player.getPlayer().loop = loop;
      },

      isMuted: function() {
        return Player.getPlayer().muted;
      },

      setMuted: function(muted) {
        Player.getPlayer().muted = muted;
      },

      getNetworkState: function() {
        return Player.getPlayer().networkState;
      },

      isPaused: function() {
        return Player.getPlayer().paused;
      },

      getPlaybackRate: function() {
        return Player.getPlayer().playbackRate;
      },

      setPlaybackRate: function(playbackRate) {
        Player.getPlayer().playbackRate = playbackRate;
      },

      getPlayed: function() {
        return Player.getPlayer().played;
      },

      isPreload: function() {
        return Player.getPlayer().preload;
      },

      setPreload: function(preload) {
        Player.getPlayer().preload = preload;
      },

      getReadyState: function() {
        return Player.getPlayer().readyState;
      },

      getSeekable: function() {
        return Player.getPlayer().seekable;
      },

      isSeeking: function() {
        return Player.getPlayer().seeking;
      },

      getStartDate: function() {
        return Player.getPlayer().startDate;
      },

      getVolume: function() {
        return Player.getPlayer().volume;
      },

      setVolume: function(volume) {
        Player.getPlayer().volume = volume;
      }
    }

    return Player;
  }]);

  app.directive('mpPlayer', ['Player', function(Player) {
    return {
      templateUrl: './views/player/player.tmpl.html',
      transclude: true,
      scope: {
        src: '@'
      },
      link: function($scope, el) {
        var player = Player.getPlayer()
        el[0].appendChild(player);

        $scope.$on('mp-click', function() {
          Player.playPause();
        });

        $scope.$watch('src', function(src) {
          Player.setSource(src);
        });
      }
    }
  }]);

  app.filter('secondsToDateTime', [function() {
    return function(seconds) {
        return new Date(1970, 0, 1).setSeconds(seconds);
    };
  }]);

  app.directive('mpControls', ['$interval', 'Player', function($interval, Player) {
    return {
      templateUrl: './views/player/controls.tmpl.html',
      link: function($scope, el) {
        el[0].classList.add('layout-align-space-between-center',  'layout-row');

        var seekTimer = null;

        $scope.seekPosition = 0;

        $scope.getDuration = function() {
          return Player.getDuration();
        };

        $scope.getCurrentTime = function() {
          return Player.getCurrentTime();
        };

        $scope.playPause = function() {
          Player.playPause();
        };

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

      }
    }
  }])

})(angular)
