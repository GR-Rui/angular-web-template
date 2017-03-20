Site.constant('ConfigConst', (function () {
    "use strict";

    var _version = "0.0.1";
    var _build = "2016-10-10";

    return {
        appVersion: _version,
        build: _build,
        configs: {
          api: 'http://localhost:9000/api/',
          baseUrl: '',
          debug: 'false',
          html5Mode: 'false',
          skin: 'white'
        }
    }
})());
