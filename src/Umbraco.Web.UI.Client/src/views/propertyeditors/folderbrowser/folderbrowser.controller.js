angular.module("umbraco")
.controller("Umbraco.PropertyEditors.FolderBrowserController",
    function ($rootScope, $scope, $upload, $timeout, $routeParams, mediaResource, umbRequestHelper) {
        
        var currentPageId = -1;
        $scope.creating = $routeParams.create == "true";
        
        if($routeParams.id){
            currentPageId = $routeParams.id;
        }


        //https://github.com/danialfarid/angular-file-upload
        //$upload.upload({
        //  url: umbRequestHelper.getApiUrl("mediaApiBaseUrl", "PostAddFile"),
        //  fields: {'currentFolder': $routeParams.id},
        //  file: file
        // }

        
        $scope.loadChildren = function(id){
            mediaResource.getChildren(id)
                .then(function(data) {
                    $scope.images = data.items;
                });    
        };


        //init load
        $scope.loadChildren(currentPageId);
        
});
