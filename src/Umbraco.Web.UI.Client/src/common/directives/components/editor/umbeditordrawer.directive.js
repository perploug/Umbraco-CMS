angular.module("umbraco.directives.html")
    .directive('umbEditorDrawer', function () {
        return {
            transclude: true,
            restrict: 'E',
            replace: true,        
            templateUrl: 'views/components/editor/umb-editor-drawer.html'
        };
    });