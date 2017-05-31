Site.factory('CommonSrv', ['$http', 'ConfigConst', 'localStorageService', '$q', '$log', '$state', '$rootScope',
  function ($http, ConfigConst, localStorageService, $q, $log, $state, $rootScope) {
    "use strict";
    return {
      getHeaderParams: function (params) {
        var existingSession = localStorageService.get('cybiToken');
        //var headers = {'cybiToken': existingSession ? existingSession.token : ''};
        var headers = {};
        if (params) {
          _.forOwn(params, function (value, key) {
            headers[key] = value;
          });
        }
        return headers;
      },
      post: function (url, data) {
        var self = this;
        var deferred = $q.defer();
        var headers = this.getHeaderParams();
        //data.openid=localStorageService.get('openid');
        $rootScope.openid = 'BI-LDB';// 开发模式打开，绕过权限
        data.openid = $rootScope.openid;
        $http.post(url, data, {headers: headers})
          .then(function (res) {
            // if(!self.checkAuthPassed(res.data.status)) {
            //   localStorageService.remove('openid');
            //   $state.go('error', {id: res.data.status.code, des: res.data.status.des});
            //   return;
            // }
            deferred.resolve(res.data);
            self.printInfo(res);
          }, function (err) {
            deferred.reject(err);
          });
        return deferred.promise;
      },
      get: function (url) {
        var deferred = $q.defer();
        var headers = this.getHeaderParams();
        $http.get(url, {headers: headers})
          .then(function (res) {
            if(!self.checkAuthPassed(res.data.status)) {
              localStorageService.remove('openid');
              $state.go('error', {id: res.data.status.code, des: res.data.status.des});
              return;
            }
            deferred.resolve(res.data);
            self.printInfo(res);
          }, function (err) {
            deferred.reject(err);
          });
        return deferred.promise;
      },
      printInfo: function (res) {
        var data ={
          status: res.status,
          statusText: res.statusText,
          method: res.config.method,
          params: res.config.data,
          headers: res.config.headers,
          url: res.config.url,
          response: res.data
        };
        if(ConfigConst.configs.debug && res.data) {
          $log.debug(JSON.stringify(data));
        }
      },
      checkAuthPassed: function (statusObject) {
        var ret = false;
         if(statusObject.code == '200') {
           ret = true;
         }
        return ret;
      },
      setWechatTitle: function(title){
        document.title = title;
        // hack在微信等webview中无法修改document.title的情况
        var $body = $('body');
        var $iframe = $('<iframe src="/images/placeholderimg.png"></iframe>').on('load', function() {
          setTimeout(function() {
            $iframe.off('load').remove()
          }, 0)
        }).appendTo($body)
      },
      formatJson: function(dataArr) {
        var isChina = function(s){
          var pattern=/[\u4E00-\u9FA5]|[\uFE30-\uFFA0]/gi;
          if(!pattern.exec(s)){
            return false;
          }
          else{
            return true;
          }
        };
        var ret = [];
        _.forEach(dataArr, function(item) {
          var obj = {};
          _.forOwn(item, function(value, key) {
            if(isChina(value)) {
              obj[key] = value;
            }else{
              obj[key] = _.toNumber(value);
            }
          });
          ret.push(obj);
        });
        return ret;

      }

    }
  }
]);
