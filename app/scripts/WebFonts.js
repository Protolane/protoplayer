(function(angular) {
  var app = angular.module('WebFonts', []);

  app.service('WebFontsSvc', [function() {
    var availableFonts = [
      {
        name: 'Cairo',
        bold: true,
        italic: false,
        boldItalic: false
      }, {
        name: 'Montserrat',
        bold: true,
        italic: false,
        boldItalic: false
      }, {
        name: 'Open Sans',
        bold: true,
        italic: false,
        boldItalic: false
      }, {
        name: 'Oswald',
        bold: true,
        italic: false,
        boldItalic: false
      }, {
        name: 'Roboto',
        bold: true,
        italic: true,
        boldItalic: true
      }, {
        name: 'Ubuntu',
        bold: true,
        italic: true,
        boldItalic: true
      }
    ].sort(function(a, b) {
      return a.name.localeCompare(b.name);
    });

    return {
      listAvailableFonts: function() {
        return availableFonts;
      },
      getFontByName: function(name) {
        return availableFonts.find(function(font) {
          return font.name === name;
        });
      }
    };

  }]);

})(window.angular);
