LazyLoad.js( [
      'lib/jquery/jquery.min.js',
      'lib/lodash/lodash.min.js',
    
      'lib/angular/angular.js',
      'lib/angular-animate/angular-animate.min.js',
      'lib/angular-cookies/angular-cookies.min.js',
      'lib/angular-touch/angular-touch.min.js',
      'lib/angular-sanitize/angular-sanitize.min.js',
      'lib/angular-route/angular-route.min.js',
    
      'js/umbraco.installer.js',
      'js/umbraco.directives.js'
    ], function () {
        jQuery(document).ready(function () {
            angular.bootstrap(document, ['ngSanitize', 'umbraco.install', 'umbraco.directives.validation']);
        });
    }
);