(function(angular) {
    var app = angular.module('Settings', ['SettingsDAO', 'DAOTypes']);

    app.factory('Settings', ['$rootScope', '$timeout', 'DAOTypes', 'SettingsDAOFactory', function($rootScope, $timeout, DAOTypes, SettingsDAOFactory) {
      var settings = {
        subtitles: {
          numberOfSubtitles: 1,
          languagesToSearch: [],
          specificSettings: []
        }

      };

      var a = null;
      $rootScope.$watch(function() {
        return settings;
      }, function(newValue, oldValue) {
        if (newValue !== oldValue) {
          $timeout.cancel(a);
          a = $timeout(function() {
            var jsonData = angular.toJson(newValue);
            console.log(jsonData);

            var dao = SettingsDAOFactory.createDAO(DAOTypes.LocalFile);
            dao.save(jsonData);

            a = null;
          }, 2000);
        }
      }, true);

      return settings;
    }]);
})(window.angular);
