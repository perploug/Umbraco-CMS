angular.module("umbraco.directives.html")
    .directive('umbEditor', function () {
        return {
            transclude: true,
            restrict: 'E',
            replace: true,        
            templateUrl: 'views/components/editor/umb-editor.html'
        };
    });