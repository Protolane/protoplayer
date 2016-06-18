(function(angular) {
  var fs = require('fs');
  var app = angular.module('LocalFileSettingsDAO', []);

  app.service('LocalFileSettingsDAO', [function() {
    return {
      load: function() {

      },
      save: function(data) {
        fs.writeFile("./.settings", data, function(err) {
            if(err) {
                console.error(err);
            }
        });
      }
    }
  }])
})(window.angular);
