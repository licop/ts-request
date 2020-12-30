"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var headers_1 = require("../helpers/headers");
var error_1 = require("../helpers/error");
var url_1 = require("../helpers/url");
var util_1 = require("../helpers/util");
var cookie_1 = require("../helpers/cookie");
function xhr(config) {
    return new Promise(function (resolve, reject) {
        var _a = config.data, data = _a === void 0 ? null : _a, url = config.url, _b = config.method, method = _b === void 0 ? 'get' : _b, _c = config.headers, headers = _c === void 0 ? {} : _c, responseType = config.responseType, timeout = config.timeout, cancelToken = config.cancelToken, withCredentials = config.withCredentials, xsrfCookieName = config.xsrfCookieName, xsrfHeaderName = config.xsrfHeaderName, onDownloadProgress = config.onDownloadProgress, onUploadProgress = config.onUploadProgress, validateStatus = config.validateStatus, auth = config.auth;
        var request = new XMLHttpRequest();
        request.open(method.toUpperCase(), url, true);
        configureRequest();
        addEvent();
        processHeaders();
        processCancel();
        request.send(data);
        function configureRequest() {
            if (responseType) {
                request.responseType = responseType;
            }
            if (timeout) {
                request.timeout = timeout;
            }
            // withCredentials 设置为true 跨域可以携带cookie
            if (withCredentials) {
                request.withCredentials = withCredentials;
            }
        }
        function addEvent() {
            request.onreadystatechange = function handleLoad() {
                if (request.readyState !== 4) {
                    return;
                }
                if (request.status === 0) {
                    return;
                }
                var responseHeaders = headers_1.parseHeaders(request.getAllResponseHeaders());
                var responseData = responseType && responseType !== 'text'
                    ? request.response
                    : request.responseText;
                var response = {
                    data: responseData,
                    status: request.status,
                    statusText: request.statusText,
                    headers: responseHeaders,
                    config: config,
                    request: request
                };
                handleResponse(response);
            };
            // 网络错误
            request.onerror = function handleError() {
                reject(error_1.createError('Network Error', config, null, request));
            };
            // 处理超时错误
            request.ontimeout = function handleTimeout() {
                reject(error_1.createError("Timeout of " + timeout + " ms exceeded", config, 'ECONNABORTED', request));
            };
            if (onDownloadProgress) {
                request.onprogress = onDownloadProgress;
            }
            if (onUploadProgress) {
                request.upload.onprogress = onUploadProgress;
            }
        }
        function processHeaders() {
            if (util_1.isFormData(data)) {
                delete headers['Content-Type'];
            }
            if ((withCredentials || url_1.isURLSameOrigin(url)) && xsrfCookieName) {
                var xsrfValue = cookie_1.default.read(xsrfCookieName);
                if (xsrfValue && xsrfHeaderName) {
                    headers[xsrfHeaderName] = xsrfValue;
                }
            }
            // HTTP协议中的 Authorization 请求消息头
            if (auth) {
                headers['Authorization'] =
                    'Basic ' + btoa(auth.username + ':' + auth.password);
            }
            Object.keys(headers).forEach(function (name) {
                if (data === null && name.toLowerCase() === 'content-type') {
                    delete headers[name];
                }
                else {
                    request.setRequestHeader(name, headers[name]);
                }
            });
        }
        function processCancel() {
            if (cancelToken) {
                cancelToken.promise.then(function (reason) {
                    request.abort();
                    reject(reason);
                }).catch(
                /* istanbul ignore next */
                function () {
                    // do nothing
                });
            }
        }
        function handleResponse(response) {
            if (!validateStatus || validateStatus(response.status)) {
                resolve(response);
            }
            else {
                reject(error_1.createError("Request failed with status code " + response.status, config, null, request, response));
            }
        }
    });
}
exports.default = xhr;
//# sourceMappingURL=xhr.js.map