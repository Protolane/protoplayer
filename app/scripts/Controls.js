(function(angular) {
  var app = angular.module('PlayerControls', ['Subtitles', 'WebFonts', 'Settings']);

  app.filter('secondsToDateTime', [function() {
    return function(seconds) {
        return new Date(1970, 0, 1).setSeconds(seconds);
    };
  }]);

  app.controller('FontSettingsCtrl', [function() {

    this.resetSettings = function(subtitle) {
      subtitle.useBold = false;
      subtitle.useItalic = false;
    };

    this.initValues = function(subtitle) {
      subtitle.selectedFont = null;
      subtitle.selectedColor = '#FFFFFF';
      subtitle.selectedSize = 26;
      subtitle.useBold = false;
      subtitle.useItalic = false;
      subtitle.useOutline = true;
      subtitle.outlineColor = '#000000';
      subtitle.alignTop = true;
      subtitle.relativeVerticalAlign = 0.0;
    }
  }]);

  app.directive('mpPlayerControls', ['$mdDialog', 'Settings', 'Player', 'LanguageCodesService', 'WebFontsSvc', function($mdDialog, Settings, Player, LanguageCodesService, WebFontsSvc) {
    return {
      templateUrl: './views/player/player-controls.tmpl.html',
      link: function($scope, el) {
        el[0].classList.add('layout-align-space-between-center',  'layout-row');

        $scope.subtitles = function(ev) {
          $mdDialog.show({
            controller: function($scope, $mdDialog) {

              $scope.subtitleSettings = Settings.subtitles;
              $scope.languages = LanguageCodesService.getLanguageCodes();
              $scope.availableFonts = WebFontsSvc.listAvailableFonts();

              $scope.$watch('subtitleSettings.numberOfSubtitles', function(numberOfSubtitles) {
                if (numberOfSubtitles > Settings.subtitles.specificSettings.length) {
                  var toAdd = numberOfSubtitles - Settings.subtitles.specificSettings.length;
                  for (var i = 0; i < toAdd; i++) {
                    Settings.subtitles.specificSettings.push({});
                  }
                } else if (numberOfSubtitles < Settings.subtitles.specificSettings.length){
                  Settings.subtitles.specificSettings.splice(numberOfSubtitles -1, Settings.subtitles.specificSettings.length);
                }
              });

              $scope.getComputedFont = function(settings) {
                if (!settings.selectedFont) {
                  return;
                }

                var containerSettings = {};
                containerSettings['wf-' + settings.selectedFont.name.replace(' ', '_').toLowerCase()] = true;
                containerSettings['layout-column'] = true;
                containerSettings['layout-align-' + (settings.alignTop ? 'start' : 'end' ) + '-center'] = true;


                var cssSettings = {};
                cssSettings.color = settings.selectedColor;
                cssSettings.position = 'relative';
                cssSettings['font-size'] = settings.selectedSize + 'px';
                cssSettings[(settings.alignTop ? 'top' : 'bottom' )] = (settings.relativeVerticalAlign * 100) + '%';

                if (settings.useBold) {
                  cssSettings['font-weight'] = 'bold';
                }

                if (settings.useItalic) {
                  cssSettings['font-style'] = 'italic';
                }

                if (settings.useOutline) {
                  cssSettings['text-shadow'] = '-1px 0 ' + settings.outlineColor + ', 0 1px ' + settings.outlineColor + ', 1px 0 ' + settings.outlineColor + ', 0 -1px ' + settings.outlineColor;
                }

                return {
                  containerSettings: containerSettings,
                  cssSettings: cssSettings
                }
              };

              $scope.querySearch = function(query) {
                var results = query ? $scope.languages.filter(function(lang) {
                  return (lang.alpha2.toLowerCase().includes(query.toLowerCase()) || lang.English.toLowerCase().includes(query.toLowerCase()));
                }) : [];
                return results;
              };

              $scope.hide = function() {
                $mdDialog.hide();
              };
              $scope.cancel = function() {
                $mdDialog.cancel();
              };
              $scope.answer = function(answer) {
                $mdDialog.hide(answer);
              };
            },
            templateUrl: './views/player/subtitles-dialog.tmpl.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose:false
          }).then(function(answer) {
            $scope.status = 'You said the information was "' + answer + '".';
          }, function() {
            $scope.status = 'You cancelled the dialog.';
          });
        };

      }
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
