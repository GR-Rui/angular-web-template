Site.factory('UserSrv', ['$http', 'ConfigConst', 'CommonSrv','$location',
  function ($http, ConfigConst, CommonSrv,$location) {
    "use strict";

    return {

      getBriefData: function (data) {
        var params = $location.search();
        if(params && params.code) {
          data.code = params.code;
        }
        //拼接service api
        var url = ConfigConst.configs.api + "test.json";
        // client data vs api params 匹配
        return CommonSrv.post(url, {});
      },
      getNavData: function(data){
        var url = ConfigConst.configs.api + "nav.json";
        return CommonSrv.post(url,{});
      }

    }

  }]);
