angular.module("umbraco")
.controller("Umbraco.PropertyEditors.FolderBrowserController",
    function ($rootScope, $scope, $upload, $timeout, $routeParams, mediaResource, umbRequestHelper) {
        
        var currentPageId = -1;
        $scope.creating = $routeParams.create == "true";
        
        if($routeParams.id){
            currentPageId = $routeParams.id;
        }

        $scope.$watch('files', function () {
            $scope.upload($scope.files);
        });


        function readmultifiles(files) {
            var reader = new FileReader();  
            function readFile(index) {
                if( index >= files.length ) return;

                var file = files[index];
                reader.onload = function(e) {  
                    // get file content  
                    var bin = e.target.result; 

                    // do sth with bin
                    $scope.$apply(function(){
                        files[index].inBrowserSrc = bin;
                        readFile(index+1)
                    });
                }

                reader.readAsDataURL(file);
            }
            readFile(0);
        }


        $scope.upload = function (files) {
            if (files && files.length) {
                
                $scope.uploading = true;
                readmultifiles(files);

                for (var i = 0; i < files.length; i++) {
                    var file = files[i];
                    file.progress = 0;                    
                    $upload.upload({
                        url: umbRequestHelper.getApiUrl("mediaApiBaseUrl", "PostAddFile"),
                        fields: {'currentFolder': $routeParams.id},
                        file: file
                    }).progress(function (evt) {
                        var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                        evt.config.file.progress = progressPercentage;
                    }).success(function (data, status, headers, config) {

                        var index = files.indexOf(config.file);
                        if(index >= 0){
                             files.splice(index,1);
                        }    
                        
                        if(files.length === 0){
                            $scope.uploading = false;
                            $scope.loadChildren($routeParams.id);
                        }
                        
                        
                    });
                }
            }
        };

        
        $scope.loadChildren = function(id){
            mediaResource.getChildren(id)
                .then(function(data) {
                    $scope.images = data.items;
                });    
        };


        //init load
        $scope.loadChildren(currentPageId);
        
});
