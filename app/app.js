/**
 * Main module of the application.
 */
var SiteFilters = angular.module('SiteFilters', []);
var Site = angular.module('Site', [
  'ngAnimate',
  'ngSanitize',
  'ngCookies',
  'ngTouch',
  'ui.router',
  'LocalStorageModule',
  'SiteFilters',
  'ngResource',
  'httpPostFix'
]);

Site.config(['$stateProvider', '$urlRouterProvider', 'ConfigConst', '$logProvider', '$locationProvider',
  function ($stateProvider, $urlRouterProvider, ConfigConst, $logProvider, $locationProvider) {
    "use strict";
    $logProvider.debugEnabled(ConfigConst.configs.debug);
    //$locationProvider.html5Mode(true).hashPrefix('!');

    $stateProvider
      .state('test', {url: '/test', templateUrl: 'app/features/demo/demo.html'});

    $urlRouterProvider.otherwise('/test');

  }]);

Site.run(['$rootScope',
  function ($rootScope) {
    "use strict";

    $rootScope.$on('$stateChangeSuccess',
      function (event, toState, toParams, fromState, fromParams) {
        $rootScope.referState = fromState;
        $rootScope.referParams = fromParams;
      });
  }]);
