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

    return {
      getPlayer: function() {
        return player;
      },

      getSource: function() {
        return this.getPlayer().src;
      },

      setSource: function(src) {
        source.src = src;
        this.getPlayer().load();
      },

      play: function() {
        this.getPlayer().play();
      },

      pause: function() {
        this.getPlayer().pause();
      },

      getAudioTracks: function() {
        return this.getPlayer().audioTracks;
      },

      isAutoplay: function() {
        return this.getPlayer().autoplay;
      },

      setAutoplay: function(autoplay) {
        this.getPlayer().autoplay = autoplay;
      },

      getBuffered: function() {
        return this.getPlayer().buffered;
      },

      getCurrentSrc: function() {
        return this.getPlayer().currentSrc;
      },

      getCurrentTime: function() {
        return this.getPlayer().currentTime;
      },

      setCurrentTime: function(currentTime) {
        this.getPlayer().currentTime = currentTime;
      },

      isDefaultMuted: function() {
        return this.getPlayer().defaultMuted;
      },

      setDefaultMuted: function(defaultMuted) {
        this.getPlayer().defaultMuted = defaultMuted;
      },

      getDefaultPlaybackRate: function() {
        return this.getPlayer().defaultPlaybackRate;
      },

      setDefaultPlaybackRate: function(defaultPlaybackRate) {
        this.getPlayer().defaultPlaybackRate = defaultPlaybackRate;
      },

      getDuration: function() {
        return this.getPlayer().duration;
      },

      isEnded: function() {
        return this.getPlayer().ended;
      },

      getError: function() {
        return this.getPlayer().error;
      },

      isLoop: function() {
        return this.getPlayer().loop;
      },

      setLoop: function(loop) {
        this.getPlayer().loop = loop;
      },

      isMuted: function() {
        return this.getPlayer().muted;
      },

      setMuted: function(muted) {
        this.getPlayer().muted = muted;
      },

      getNetworkState: function() {
        return this.getPlayer().networkState;
      },

      isPaused: function() {
        return this.getPlayer().paused;
      },

      getPlaybackRate: function() {
        return this.getPlayer().playbackRate;
      },

      setPlaybackRate: function(playbackRate) {
        this.getPlayer().playbackRate = playbackRate;
      },

      getPlayed: function() {
        return this.getPlayer().played;
      },

      isPreload: function() {
        return this.getPlayer().preload;
      },

      setPreload: function(preload) {
        this.getPlayer().preload = preload;
      },

      getReadyState: function() {
        return this.getPlayer().readyState;
      },

      getSeekable: function() {
        return this.getPlayer().seekable;
      },

      isSeeking: function() {
        return this.getPlayer().seeking;
      },

      getStartDate: function() {
        return this.getPlayer().startDate;
      },

      getVolume: function() {
        return this.getPlayer().volume;
      },

      setVolume: function(volume) {
        this.getPlayer().volume = volume;
      }
    }
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

        $scope.$watch('src', function(src) {
          Player.setSource(src);
        });
      }
    }
  }]);

  app.directive('mpControls', ['Player', function(Player) {
    return {
      templateUrl: './views/player/controls.tmpl.html',
      link: function($scope, el) {
        el[0].classList.add('layout-align-space-between-center',  'layout-row');

        $scope.$on('mp-play', function(event, data) {
          console.log(event, data);
        });

        $scope.playPause = function() {
          if (Player.isPaused()) {
            Player.play();
          } else {
            Player.pause();
          }
        };
      }
    }
  }])

})(angular)
