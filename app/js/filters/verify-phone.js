angular.module('SiteFilters')
  .filter('regMobile', function () {
    'use strict';
    return function (str) {
      str = _.trim(str);
      var isPassed = !!str.match(/^(0|86|17951)?(13[0-9]|15[0-9]|17[0-9]|18[0-9]|14[0-9])[0-9]{8}$/);
      return isPassed;
    };
  });

