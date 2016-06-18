(function() {
    var app = angular.module('Subtitles', []);

    app.factory('LanguageCodesService', ['$http', function($http) {
      var languages = null;

      $http({
        method: 'GET',
        url: './data/language-codes.json'
      }).then(function(response) {
        if (response.status === 200) {
          languages = response.data;
        }
      });

      return {
        getLanguageCodes: function() {
          return languages;
        }
      };
    }]);

})(window.angular);
