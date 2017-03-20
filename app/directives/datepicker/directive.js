/**
 * Created by qianqian on 2017/2/7.
 */

Site.directive('datePicker', [function () {
  return {
    scope:{
      calender:'='
    },
    restrict: 'AE',
    link: function (scope, element, attr, ctrl) {
      var calender = scope.calender;
      calender.el = element;
      new Calendar(calender);
    }
  }
}]);
