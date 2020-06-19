var h54sError = require('./error.js');

const sasVersionMap = {
	v9: {
		url: '/SASStoredProcess/do',
		logoutUrl: '/SASStoredProcess/do?_action=logoff'
	},
	viya: {
		url: '/SASJobExecution/',
		logoutUrl: '/SASLogon/logout.do?'
	}
}

/*
* Represents html5 for sas adapter
* @constructor
*
*@param {object} config - adapter config object, with keys like url, debug, etc.
*
*/
var h54s = module.exports = function(config) {
	this.sasVersion = config.sasVersion || 'v9'

  // first thing first - set sas version config
  const sasVersionConfig = sasVersionMap[this.sasVersion] || sasVersionMap['v9'] //use v9 as default=

  //default config values
  this.maxXhrRetries        = 5;
  this.url                  = sasVersionConfig.url
  this.isViya								= this.url === '/SASJobExecution/'
  this.debug                = true;
  this.loginUrl             = '/SASLogon/login.do';
  this.logoutUrl            = sasVersionConfig.logoutUrl
  this.retryAfterLogin      = true;
  this.ajaxTimeout          = config.ajaxTimeout || 300000;
  this.useMultipartFormData = true;
  this.RESTauth             = false;
  this.RESTauthLoginUrl     = '/SASLogon/v1/tickets';
  this.csrf                 = ''

  this.remoteConfigUpdateCallbacks = [];
  this._pendingCalls = [];
  this._customPendingCalls = [];
  this._disableCalls = false
  this._ajax = require('./methods/ajax.js')();

  _setConfig.call(this, config);

  //override with remote if set
  if(config && config.isRemoteConfig) {
    var self = this;

    this._disableCalls = true;
    this._customDisableCalls = true;

    // 'h54sConfig.json' is for the testing with karma
    //replaced with gulp in dev build
    this._ajax.get('h54sConfig.json').success(function(res) {
      var remoteConfig = JSON.parse(res.responseText);

      for(var key in remoteConfig) {
        if(remoteConfig.hasOwnProperty(key) && config[key] === undefined && key !== 'isRemoteConfig') {
          config[key] = remoteConfig[key];
        }
      }

      _setConfig.call(self, config);

      //execute callbacks when we have remote config
      //note that remote conifg is merged with instance config
      for(var i = 0, n = self.remoteConfigUpdateCallbacks.length; i < n; i++) {
        var fn = self.remoteConfigUpdateCallbacks[i];
        fn();
      }

      //execute sas calls disabled while waiting for the config
      self._disableCalls = false;
      while(self._pendingCalls.length > 0) {
        var pendingCall = self._pendingCalls.shift();
        var sasProgram  = pendingCall.sasProgram;
        var callback    = pendingCall.callback;
        var params      = pendingCall.params;

        //update program with metadataRoot if it's not set
        if(self.metadataRoot && pendingCall.params._program.indexOf(self.metadataRoot) === -1) {
          pendingCall.params._program = self.metadataRoot.replace(/\/?$/, '/') + pendingCall.params._program.replace(/^\//, '');
        }

        //update debug because it may change in the meantime
        params._debug = self.debug ? 131 : 0;

        self.call(sasProgram, null, callback, params);
      }

      //execute custom calls that we made while waitinf for the config
      self._customDisableCalls = false;
      while(self._pendingCalls.length > 0) {
      	//TODO - Implement logic that will reflect managedRequest method
        // const pendingCall = self._customPendingCalls.shift();
        // const sasProgram  = pendingCall.sasProgram;
        // const callback    = pendingCall.callback;
        // const params      = pendingCall.params;
				//
        // //update program with metadataRoot if it's not set
        // if(self.metadataRoot && pendingCall.params._program.indexOf(self.metadataRoot) === -1) {
        //   pendingCall.params._program = self.metadataRoot.replace(/\/?$/, '/') + pendingCall.params._program.replace(/^\//, '');
        // }
				//
        // //update debug because it may change in the meantime
        // params._debug = self.debug ? 131 : 0;
				//
        // self.call(sasProgram, null, callback, params);
      }
    }).error(function (err) {
      throw new h54sError('ajaxError', 'Remote config file cannot be loaded. Http status code: ' + err.status);
    });
  }

  // private function to set h54s instance properties
  function _setConfig(config) {
    if(!config) {
      this._ajax.setTimeout(this.ajaxTimeout);
      return;
    } else if(typeof config !== 'object') {
      throw new h54sError('argumentError', 'First parameter should be config object');
    }

    //merge config object from parameter with this
    for(var key in config) {
      if(config.hasOwnProperty(key)) {
        if((key === 'url' || key === 'loginUrl') && config[key].charAt(0) !== '/') {
          config[key] = '/' + config[key];
        }
        this[key] = config[key];
      }
    }

    //if server is remote use the full server url
    //NOTE: this is not permited by the same-origin policy
    if(config.hostUrl) {
      if(config.hostUrl.charAt(config.hostUrl.length - 1) === '/') {
        config.hostUrl = config.hostUrl.slice(0, -1);
      }
      this.hostUrl          = config.hostUrl;
      this.url              = config.hostUrl + this.url;
      this.loginUrl         = config.hostUrl + this.loginUrl;
      this.RESTauthLoginUrl = config.hostUrl + this.RESTauthLoginUrl;
    }

    this._ajax.setTimeout(this.ajaxTimeout);
  }
};

//replaced with gulp
h54s.version = '__version__';


h54s.prototype = require('./methods/index');

h54s.Tables = require('./tables/index');
h54s.Files = require('./files/index');
h54s.SasData = require('./sasData.js');

h54s.fromSasDateTime = require('./methods/utils.js').fromSasDateTime;
h54s.toSasDateTime = require('./tables/utils.js').toSasDateTime;

//self invoked function module
require('./ie_polyfills.js');
