var expandable = angular.module('expandable', []);

expandable.directive("expandable", function() {
  return {
    scope: {
      widthMin: "@",
      widthMax: "@",
      heightMin: "@",
      heightMax: "@"
    },
    restrict: "A",
    controller: function($scope) {
      this.toggle = function() {
        var targetStatus = {};

        if ($scope.expanded) {
          if ($scope.widthMin) {
            angular.extend(targetStatus, { width: $scope.widthMin });
          }
          if ($scope.heightMin) {
            angular.extend(targetStatus, { height: $scope.heightMin });
          }
        } else {
          if ($scope.widthMax) {
            angular.extend(targetStatus, { width: $scope.widthMax });
          }
          if ($scope.heightMax) {
            angular.extend(targetStatus, { height: $scope.heightMax });
          }
        }

        $scope.morph(targetStatus);
      };
    },
    link: function(scope, elem, attrs) {
      scope.expanded = attrs.expanded !== undefined;

      scope.morph = function(targetStatus) {
        scope.expanded = !scope.expanded;
        elem.css(targetStatus);
      };
    }
  };
});

expandable.directive("expandableTrigger", function() {
  return {
    scope: false,
    restrict: "A",
    require: "^expandable",
    link: function(scope, elem, attr, expandable) {
      scope.toggle = expandable.toggle.bind(expandable);
    }
  };
});
