var app = angular.module('umbraco', [
	'umbraco.filters',
	'umbraco.directives',
	'umbraco.resources',
	'umbraco.services',
	'umbraco.packages',
    
   	'ngRoute',
    'ngCookies',
    'ngTouch',
    'ngSanitize',
    'ngAnimate',

    'angularFileUpload',
    'tmh.dynamicLocale'
]);
var packages = angular.module("umbraco.packages", []);