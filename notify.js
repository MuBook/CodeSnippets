angular.module("Notify", [])
.constant("NotifyDefault", {
  duration: 5000,
  dismissable: true
})
.provider("Notify", ["NotifyDefault", function(NotifyDefault) {
  var _config = NotifyDefault;

  this.config = function(config) {
    angular.extend(_config, config);
  };

  this.$get = ["$timeout", function($timeout) {
    var Notify = {
      $container: function(container) {
        _config.container = container;
      },
      $dismissable: _config.dismissable,
      $notify: function(message, status) {
        _config.container.notify(message, status);
        $timeout(function() {
          _config.container.notifications.shift();
          _config.container.$apply();
        }, _config.duration);
      },
      info: function(message) {
        this.$notify(message, 'info');
      },
      success: function(message) {
        this.$notify(message, 'success');
      },
      error: function(message) {
        this.$notify(message, 'danger');
      },
      warn: function(message) {
        this.$notify(message, 'warning');
      }
    };
    return Notify;
  }];
}])
.directive("notification", ["Notify", function(Notify) {
  return {
    restrict: "E",
    scope: true,
    templateUrl: "directives/notification.html",
    link: function(scope, elem) {
      Notify.$container(scope);

      scope.dismissable = Notify.$dismissable;

      scope.notifications = [];

      scope.notify = function(message, status) {
        scope.notifications.push({ message: message, status: status });
      };
    }
  };
}]);
