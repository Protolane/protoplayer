(function(angular) {
  var app = angular.module('SettingsDAO', ['DAOTypes', 'LocalFileSettingsDAO']);

  app.factory('SettingsDAOFactory', ['DAOTypes', 'LocalFileSettingsDAO', function(DAOTypes, LocalFileSettingsDAO) {
    return {
      createDAO: function(type) {
        switch(type) {
          case DAOTypes.LocalFile: {
            return LocalFileSettingsDAO;
          }
        };
      }
    }
  }]);
})(window.angular);
