var h54sError = require('../error.js');
var logs = require('../logs.js');
var Tables = require('../tables/index');
var SasData = require('../sasData.js');
var Files = require('../files/index');

/*
* Call Sas program
*
* @param {string} sasProgram - Path of the sas program
* @param {function} callback - Callback function called when ajax call is finished
*
*/
// TODO add url as a param - it will be /SASJobExecution/ most of the time
module.exports.call = function (sasProgram, dataObj, callback, params) {
  var self = this;
  var retryCount = 0;
  var dbg = this.debug;
  var csrf = this.csrf;

  if (!callback || typeof callback !== 'function') {
    // throw new h54sError('argumentError', 'You must provide callback');
    throw new h54sError('argumentError', 'You must provide callback');
  }
  if (!sasProgram) {
    // throw new h54sError('argumentError', 'You must provide Sas program file path');
    console.log(new h54sError('argumentError', 'You must provide Sas program file path'))
  }
  if (typeof sasProgram !== 'string') {
    // throw new h54sError('argumentError', 'First parameter should be string');
    console.log(new h54sError('argumentError', 'First parameter should be string'))
  }
  if (this.useMultipartFormData === false && !(dataObj instanceof Tables)) {
    // throw new h54sError('argumentError', 'Cannot send files using application/x-www-form-urlencoded. Please use Tables or default value for useMultipartFormData');
    console.log(new h54sError('argumentError', 'Cannot send files using application/x-www-form-urlencoded. Please use Tables or default value for useMultipartFormData'))
  }

  if (!params) {
    params = {
      _program: this._utils.getFullProgramPath(this.metadataRoot, sasProgram),
      _debug: this.debug ? 131 : 0,
      _service: 'default',
      _csrf: csrf
    };
  } else {
    params = Object.assign({}, params, {_csrf: csrf})
  }

  if (dataObj) {
    var key, dataProvider;
    if (dataObj instanceof Tables) {
      dataProvider = dataObj._tables;
    } else if (dataObj instanceof Files || dataObj instanceof SasData) {
      dataProvider = dataObj._files;
    } else {
      console.log(new h54sError('argumentError', 'Wrong type of tables object'))
    }
    for (key in dataProvider) {
      if (dataProvider.hasOwnProperty(key)) {
        params[key] = dataProvider[key];
      }
    }
  }

  if (this._disableCalls) {
    this._pendingCalls.push({
      params,
      options: {
        sasProgram,
        dataObj,
        callback
      }
    });
    return;
  }

  this._ajax.post(this.url, params, this.useMultipartFormData).success(async function (res) {
    if (self._utils.needToLogin.call(self, res)) {
      //remember the call for latter use
      self._pendingCalls.push({
        params,
        options: {
          sasProgram,
          dataObj,
          callback
        }
      });

      //there's no need to continue if previous call returned login error
      if (self._disableCalls) {
        return;
      } else {
        self._disableCalls = true;
      }

      callback(new h54sError('notLoggedinError', 'You are not logged in'));
    } else {
      var resObj, unescapedResObj, err;
      var done = false;

      if (!dbg) {
        try {
          resObj = self._utils.parseRes(res.responseText, sasProgram, params);
          logs.addApplicationLog(resObj.logmessage, sasProgram);

          if (dataObj instanceof Tables) {
            unescapedResObj = self._utils.unescapeValues(resObj);
          } else {
            unescapedResObj = resObj;
          }

          if (resObj.status !== 'success') {
            err = new h54sError('programError', resObj.errormessage, resObj.status);
          }

          done = true;
        } catch (e) {
          if (e instanceof SyntaxError) {
            if (retryCount < self.maxXhrRetries) {
              done = false;
              self._ajax.post(self.url, params, self.useMultipartFormData).success(this.success).error(this.error);
              retryCount++;
              logs.addApplicationLog("Retrying #" + retryCount, sasProgram);
            } else {
              self._utils.parseErrorResponse(res.responseText, sasProgram);
              self._utils.addFailedResponse(res.responseText, sasProgram);
              err = new h54sError('parseError', 'Unable to parse response json');
              done = true;
            }
          } else if (e instanceof h54sError) {
            self._utils.parseErrorResponse(res.responseText, sasProgram);
            self._utils.addFailedResponse(res.responseText, sasProgram);
            err = e;
            done = true;
          } else {
            self._utils.parseErrorResponse(res.responseText, sasProgram);
            self._utils.addFailedResponse(res.responseText, sasProgram);
            err = new h54sError('unknownError', e.message);
            err.stack = e.stack;
            done = true;
          }
        } finally {
          if (done) {
            callback(err, unescapedResObj);
          }
        }
      } else {
        try {
          resObj = await self._utils.parseDebugRes(res.responseText, sasProgram, params, self.hostUrl, self.isViya, self.managedRequest.bind(self));
          logs.addApplicationLog(resObj.logmessage, sasProgram);

          if (dataObj instanceof Tables) {
            unescapedResObj = self._utils.unescapeValues(resObj);
          } else {
            unescapedResObj = resObj;
          }

          if (resObj.status !== 'success') {
            err = new h54sError('programError', resObj.errormessage, resObj.status);
          }

          done = true;
        } catch (e) {
          if (e instanceof SyntaxError) {
            err = new h54sError('parseError', e.message);
            done = true;
          } else if (e instanceof h54sError) {
            if (e.type === 'parseError' && retryCount < 1) {
              done = false;
              self._ajax.post(self.url, params, self.useMultipartFormData).success(this.success).error(this.error);
              retryCount++;
              logs.addApplicationLog("Retrying #" + retryCount, sasProgram);
            } else {
              if (e instanceof h54sError) {
                err = e;
              } else {
                err = new h54sError('parseError', 'Unable to parse response json');
              }
              done = true;
            }
          } else {
            err = new h54sError('unknownError', e.message);
            err.stack = e.stack;
            done = true;
          }
        } finally {
          if (done) {
            callback(err, unescapedResObj);
          }
        }
      }
    }
  }).error(function (res) {
    let _csrf
		if (res.status == 449 || (res.status == 403 && (res.responseText.includes('_csrf') || res.getResponseHeader('X-Forbidden-Reason') === 'CSRF') && (_csrf = res.getResponseHeader(res.getResponseHeader('X-CSRF-HEADER'))))) {
      params['_csrf'] = _csrf;
      self.csrf = _csrf
      if (retryCount < self.maxXhrRetries) {
        self._ajax.post(self.url, params, true).success(this.success).error(this.error);
        retryCount++;
        logs.addApplicationLog("Retrying #" + retryCount, sasProgram);
      } else {
        self._utils.parseErrorResponse(res.responseText, sasProgram);
        self._utils.addFailedResponse(res.responseText, sasProgram);
        callback(new h54sError('parseError', 'Unable to parse response json'));
      }
    } else {
      logs.addApplicationLog('Request failed with status: ' + res.status, sasProgram);
      // if request has error text else callback
      callback(new h54sError('httpError', res.statusText));
    }
  });
};

/*
* Login method
*
* @param {string} user - Login username
* @param {string} pass - Login password
* @param {function} callback - Callback function called when ajax call is finished
*
* OR
*
* @param {function} callback - Callback function called when ajax call is finished
*
*/
//TODO Create login funciton with promises for proper login feature
module.exports.login = function (user, pass, callback) {
  if (!user || !pass) {
    throw new h54sError('argumentError', 'Credentials not set');
  }
  if (typeof user !== 'string' || typeof pass !== 'string') {
    throw new h54sError('argumentError', 'User and pass parameters must be strings');
  }
  //NOTE: callback optional?
  if (!callback || typeof callback !== 'function') {
    throw new h54sError('argumentError', 'You must provide callback');
  }

  if (!this.RESTauth) {
    handleSasLogon.call(this, user, pass, callback);
  } else {
    handleRestLogon.call(this, user, pass, callback);
  }
};

/*
* ManagedPost method
*
* @param {string} callMethod - get, post
* @param {string} _url
* @param {json} params - must be empty object
* @param {json} options - must to carry on callback function
*
*
*/
module.exports.managedRequest = function (callMethod = 'get', _url, options = {
  callback: () => console.log('Missing callback funciton')
}) {
  const self = this;
  const csrf = this.csrf;
  let retryCount = 0;
  const {useMultipartFormData, sasProgram, dataObj, params, callback, headers} = options

  // TODO - Extend managedRequest method to accept regular call with params sasProgram and dataObj
  if (sasProgram) {
    return self.call(sasProgram, dataObj, callback, params)
  }

  let url = _url
  if (!_url.startsWith('http')) {
    url = self.hostUrl + _url
  }

  const _headers = Object.assign({}, headers, {
    'X-CSRF-TOKEN': csrf
  })
  const _options = Object.assign({}, options, {
    headers: _headers
  })

  if (this._disableCalls) {
    this._customPendingCalls.push({
      callMethod,
      _url,
      options: _options
    });
    return;
  }

  self._ajax[callMethod](url, params, useMultipartFormData, _headers).success(function (res) {
    if (self._utils.needToLogin.call(self, res)) {
      //remember the call for latter use
      self._customPendingCalls.push({
        callMethod,
        _url,
        options: _options
      });

      //there's no need to continue if previous call returned login error
      if (self._disableCalls) {
        return;
      } else {
        self._disableCalls = true;
      }

      callback(new h54sError('notLoggedinError', 'You are not logged in'));
    } else {
      let resObj, err;
      let done = false;

      try {
        // todo: check that this returns valid json or something
        // resObj = res.responseText;
        // done = true;

        const arr = res.getAllResponseHeaders().split('\r\n');
        const resHeaders = arr.reduce(function (acc, current, i) {
          let parts = current.split(': ');
          acc[parts[0]] = parts[1];
          return acc;
        }, {});
        let body = res.responseText
        try {
          body = JSON.parse(body)
        } catch (e) {
          console.log('response is not JSON string')
        } finally {
          resObj = Object.assign({}, {
            headers: resHeaders,
            status: res.status,
            statusText: res.statusText,
            body
          })
          done = true;
        }


      } catch (e) {
        err = new h54sError('unknownError', e.message);
        err.stack = e.stack;
        done = true;

      } finally {
        if (done) {
          callback(err, resObj)
        }

      }
    }
  }).error(function (res) {
    let _csrf
		if (res.status == 449 || (res.status == 403 && (res.responseText.includes('_csrf') || res.getResponseHeader('X-Forbidden-Reason') === 'CSRF') && (_csrf = res.getResponseHeader(res.getResponseHeader('X-CSRF-HEADER'))))) {
      self.csrf = _csrf
      const _headers = Object.assign({}, headers, {[res.getResponseHeader('X-CSRF-HEADER')]: _csrf})
      if (retryCount < self.maxXhrRetries) {
        self._ajax[callMethod](url, params, useMultipartFormData, _headers).success(this.success).error(this.error);
        retryCount++;
      } else {
        // todo: add fail condition that is not related to data call
        callback(new h54sError('parseError', 'Unable to parse response json'));
      }
    } else {
      logs.addApplicationLog('Managed request failed with status: ' + res.status, _url);
      // if request has error text else callback
      callback(new h54sError('httpError1', res.responseText, res.status));
    }
  });
}


function handleSasLogon(user, pass, callback) {
  var self = this;

  var loginParams = {
    _service: 'default',
    //for SAS 9.4,
    username: user,
    password: pass
  };

  for (var key in this._aditionalLoginParams) {
    loginParams[key] = this._aditionalLoginParams[key];
  }

  this._loginAttempts = 0;

  this._ajax.post(this.loginUrl, loginParams)
    .success(handleSasLogonSuccess)
    .error(handleSasLogonError);

  function handleSasLogonError(res) {
    if (res.status == 449) {
      handleSasLogonSuccess(res);
      return;
    }

    logs.addApplicationLog('Login failed with status code: ' + res.status);
    callback(res.status);
  }

  function handleSasLogonSuccess(res) {
    if (++self._loginAttempts === 3) {
      return callback(-2);
    }
    if (self._utils.needToLogin.call(self, res)) {
      //we are getting form again after redirect
      //and need to login again using the new url
      //_loginChanged is set in needToLogin function
      //but if login url is not different, we are checking if there are aditional parameters
      if (self._loginChanged || (self._isNewLoginPage && !self._aditionalLoginParams)) {
        delete self._loginChanged;
        var inputs = res.responseText.match(/<input.*"hidden"[^>]*>/g);
        if (inputs) {
          inputs.forEach(function (inputStr) {
            var valueMatch = inputStr.match(/name="([^"]*)"\svalue="([^"]*)/);
            loginParams[valueMatch[1]] = valueMatch[2];
          });
        }
        self._ajax.post(self.loginUrl, loginParams).success(function () {
          //we need this get request because of the sas 9.4 security checks
          self._ajax.get(self.url).success(handleSasLogonSuccess).error(handleSasLogonError);
        }).error(handleSasLogonError);
      }
      else {
        //getting form again, but it wasn't a redirect
        logs.addApplicationLog('Wrong username or password');
        callback(-1);
      }
    }
    else {
      self._disableCalls = false;
      callback(res.status);
      while (self._pendingCalls.length > 0) {
        var pendingCall = self._pendingCalls.shift();
        var method = pendingCall.method || self.call.bind(self);
        var sasProgram = pendingCall.options.sasProgram;
        var callbackPending = pendingCall.options.callback;
        var params = pendingCall.params;
        //update debug because it may change in the meantime
        params._debug = self.debug ? 131 : 0;
        if (self.retryAfterLogin) {
          method(sasProgram, null, callbackPending, params);
        }
      }
    }
  };
}

function handleRestLogon(user, pass, callback) {
  var self = this;

  var loginParams = {
    username: user,
    password: pass
  };

  this._ajax.post(this.RESTauthLoginUrl, loginParams).success(function (res) {
    var location = res.getResponseHeader('Location');

    self._ajax.post(location, {
      service: self.url
    }).success(function (res) {
      if (self.url.indexOf('?') === -1) {
        self.url += '?ticket=' + res.responseText;
      } else {
        if (self.url.indexOf('ticket') !== -1) {
          self.url = self.url.replace(/ticket=[^&]+/, 'ticket=' + res.responseText);
        } else {
          self.url += '&ticket=' + res.responseText;
        }
      }

      callback(res.status);
    }).error(function (res) {
      logs.addApplicationLog('Login failed with status code: ' + res.status);
      callback(res.status);
    });
  }).error(function (res) {
    if (res.responseText === 'error.authentication.credentials.bad') {
      callback(-1);
    } else {
      logs.addApplicationLog('Login failed with status code: ' + res.status);
      callback(res.status);
    }
  });
}

/*
* Logout method
*
* @param {function} callback - Callback function called when ajax call is finished
*
*/

module.exports.logout = function (callback) {
  var baseUrl = this.hostUrl || '';
  var url = baseUrl + this.logoutUrl;

  this._ajax.get(url).success(function (res) {
    this._disableCalls = true
    callback();
  }).error(function (res) {
    logs.addApplicationLog('Logout failed with status code: ' + res.status);
    callback(res.status);
  });
};

/*
* Enter debug mode
*
*/
module.exports.setDebugMode = function () {
  this.debug = true;
};

/*
* Exit debug mode
*
*/
module.exports.unsetDebugMode = function () {
  this.debug = false;
};

for (var key in logs.get) {
  if (logs.get.hasOwnProperty(key)) {
    module.exports[key] = logs.get[key];
  }
}

for (var key in logs.clear) {
  if (logs.clear.hasOwnProperty(key)) {
    module.exports[key] = logs.clear[key];
  }
}

/*
* Add callback functions executed when properties are updated with remote config
*
*@callback - callback pushed to array
*
*/
module.exports.onRemoteConfigUpdate = function (callback) {
  this.remoteConfigUpdateCallbacks.push(callback);
};

module.exports._utils = require('./utils.js');


// PROMISE FUNCTIONS
module.exports.promiseLogin = function (user, pass) {
  return new Promise((resolve, reject) => {
    if (!user || !pass) {
      reject(new h54sError('argumentError', 'Credentials not set'))
    }
    if (typeof user !== 'string' || typeof pass !== 'string') {
      reject(new h54sError('argumentError', 'User and pass parameters must be strings'))
    }
    if (!this.RESTauth) {
      customHandleSasLogon.call(this, user, pass, resolve);
      // promiseHandleSasLogon.call(this, user, pass, resolve, reject);
    } else {
      customHandleRestLogon.call(this, user, pass, resolve);
      // handleRestLogon.call(this, user, pass, resolve);
    }
  })
}

function customHandleSasLogon(user, pass, callback) {
  const self = this;
  let loginParams = {
    _service: 'default',
    //for SAS 9.4,
    username: user,
    password: pass
  };

  for (let key in this._aditionalLoginParams) {
    loginParams[key] = this._aditionalLoginParams[key];
  }

  this._loginAttempts = 0;
  loginParams = this._ajax.serialize(loginParams)

  this._ajax.post(this.loginUrl, loginParams)
    .success(handleSasLogonSuccess)
    .error(handleSasLogonError);

  function handleSasLogonError(res) {
    if (res.status == 449) {
      handleSasLogonSuccess(res);
      // resolve(res.status);
    } else {
      logs.addApplicationLog('Login failed with status code: ' + res.status);
      callback(res.status);
    }
  }

  function handleSasLogonSuccess(res) {
    if (++self._loginAttempts === 3) {
      callback(-2);
    }

    if (self._utils.needToLogin.call(self, res)) {
      //we are getting form again after redirect
      //and need to login again using the new url
      //_loginChanged is set in needToLogin function
      //but if login url is not different, we are checking if there are aditional parameters
      if (self._loginChanged || (self._isNewLoginPage && !self._aditionalLoginParams)) {
        delete self._loginChanged;
        const inputs = res.responseText.match(/<input.*"hidden"[^>]*>/g);
        if (inputs) {
          inputs.forEach(function (inputStr) {
            const valueMatch = inputStr.match(/name="([^"]*)"\svalue="([^"]*)/);
            loginParams[valueMatch[1]] = valueMatch[2];
          });
        }
        self._ajax.post(self.loginUrl, loginParams).success(function () {
          //we need this get request because of the sas 9.4 security checks
          //TODO Is this necessary ???? because all pending calls should be calld after this howerver.
          // self._ajax[callMethod](url).success(handleSasLogonSuccess).error(handleSasLogonError);
          handleSasLogonSuccess()
        }).error(handleSasLogonError);
      }
      else {
        //getting form again, but it wasn't a redirect
        logs.addApplicationLog('Wrong username or password');
        callback(-1);
      }
    }
    else {
      self._disableCalls = false;
      callback(res.status);
      while (self._customPendingCalls.length > 0) {
        const pendingCall = self._customPendingCalls.shift()
        const method = pendingCall.method || self.managedRequest.bind(self);
        const callMethod = pendingCall.callMethod
        const _url = pendingCall._url
        const options = pendingCall.options;
        //update debug because it may change in the meantime
        if (options.params) {
          options.params._debug = self.debug ? 131 : 0;
        }
        if (self.retryAfterLogin) {
          method(callMethod, _url, options);
        }
      }
    }
  };
}


function customHandleRestLogon(user, pass, callback, callbackUrl) {
  var self = this;

  var loginParams = {
    username: user,
    password: pass
  };

  this._ajax.post(this.RESTauthLoginUrl, loginParams).success(function (res) {
    var location = res.getResponseHeader('Location');

    self._ajax.post(location, {
      service: callbackUrl
    }).success(function (res) {
      if (callbackUrl.indexOf('?') === -1) {
        callbackUrl += '?ticket=' + res.responseText;
      } else {
        if (callbackUrl.indexOf('ticket') !== -1) {
          callbackUrl = callbackUrl.replace(/ticket=[^&]+/, 'ticket=' + res.responseText);
        } else {
          callbackUrl += '&ticket=' + res.responseText;
        }
      }

      callback(res.status);
    }).error(function (res) {
      logs.addApplicationLog('Login failed with status code: ' + res.status);
      callback(res.status);
    });
  }).error(function (res) {
    if (res.responseText === 'error.authentication.credentials.bad') {
      callback(-1);
    } else {
      logs.addApplicationLog('Login failed with status code: ' + res.status);
      callback(res.status);
    }
  });
}

module.exports.getObjOfTable = function (table, key, value = null) {
	const obj = {}
	table.forEach(row => {
		obj[row[key]] = value ? row[value] : row
	})
	return obj
}
