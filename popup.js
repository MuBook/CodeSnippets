angular.module('popup', [])
.run(["$window", "PopupControl", function($window, PopupControl) {
  $($window).on("keyup", function(event) {
    if (event.which === 27) {
      PopupControl.closeAll();
    }
  }).on("click", function(event) {
    if (event.which === 1) {
      PopupControl.closeAll();
    }
  });
}])
.directive("popup", function() {
  return {
    restrict: "A",
    link: function(scope, elem, attr) {
      elem.on("click", function(event) { event.stopPropagation(); });
    }
  };
})
.factory("PopupControl", ["$rootScope", "$timeout", function($rootScope, $timeout) {
  var popups = {},
      visiblePopups = {};

  function Popup() {
    this.visible = false;
    this.standalone = false;
    this.group = "default";
    this.scope = null;
  }

  Popup.prototype.onOpen = Popup.prototype.onClose = Popup.prototype.onToggle = function() {};
  Popup.prototype.open = function() { this.visible = true; return this; };
  Popup.prototype.close = function() { this.visible = false; return this; };

  function closeHelper(group) {
    if (!group) { return; }
    var popup = visiblePopups[group];
    popup && popup.close();
    visiblePopups[group] = undefined;
  }

  var controller = {
    register: function(key, config) {
      if (popups[key]) { throw key + " already exists"; }
      if (!config.scope) { throw "Required parameter is missing: scope"; }

      var popup = popups[key] = new Popup;

      angular.extend(popup, config);

      return function(options) {
        if (popup.visible) {
          if (popup.onClose(options) !== false) { popup.close(); }
        } else {
          controller.closeAll(popup.group);

          if (popup.onOpen(options) !== false) { popup.open(); }

          if (!popup.standalone) {
            visiblePopups[popup.group] = popup;
          }
        }
        popup.onToggle(options);
      };
    },

    visibilityOf: function(key) {
      return function() {
        return popups[key].visible;
      };
    },

    closeAll: function(group) {
      if (group === undefined) {
        for (var group in visiblePopups) {
          closeHelper(group);
        }
      } else {
        closeHelper(group);
      }
      $rootScope.$applyAsync();
    }
  };

  return controller;
}]);
