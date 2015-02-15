var app = angular.module('umbraco', [
	'umbraco.filters',
	'umbraco.directives',
	'umbraco.resources',
	'umbraco.services',
	'umbraco.httpbackend',
    
    'ngRoute',
    'ngCookies',
    'ngTouch',
    'ngSanitize',
    'ngAnimate',

    'angularFileUpload',
    'tmh.dynamicLocale'
]);