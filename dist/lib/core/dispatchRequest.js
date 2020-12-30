"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformURL = void 0;
var url_1 = require("../helpers/url");
var headers_1 = require("../helpers/headers");
var xhr_1 = require("./xhr");
var transform_1 = require("./transform");
function dispatchRequest(config) {
    throwIfCancellationRequested(config);
    processConfig(config);
    return xhr_1.default(config).then(function (res) {
        return transformResponseData(res);
    }, function (e) {
        if (e && e.response) {
            e.response = transformResponseData(e.response);
        }
        return Promise.reject(e);
    });
}
exports.default = dispatchRequest;
function processConfig(config) {
    config.url = transformURL(config);
    config.data = transform_1.default(config.data, config.headers, config.transformRequest);
    config.headers = headers_1.flattenHeaders(config.headers, config.method);
}
function transformURL(config) {
    var url = config.url, params = config.params, paramsSerializer = config.paramsSerializer, baseURL = config.baseURL;
    if (baseURL && !url_1.isAbsoluteURL(url)) {
        url = url_1.combineURL(baseURL, url);
    }
    // 类型断言 url不是空
    return url_1.buildURL(url, params, paramsSerializer);
}
exports.transformURL = transformURL;
function transformResponseData(res) {
    res.data = transform_1.default(res.data, res.headers, res.config.transformResponse);
    return res;
}
function throwIfCancellationRequested(config) {
    if (config.cancelToken) {
        config.cancelToken.throwIfRequested();
    }
}
//# sourceMappingURL=dispatchRequest.js.map