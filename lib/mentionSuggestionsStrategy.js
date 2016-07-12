'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _findWithRegex = require('find-with-regex');

var _findWithRegex2 = _interopRequireDefault(_findWithRegex);

var _escapeRegExp = require('lodash/escapeRegExp');

var _escapeRegExp2 = _interopRequireDefault(_escapeRegExp);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (trigger) {
  return function (contentBlock, callback) {
    (0, _findWithRegex2.default)(new RegExp('(\\s|^)' + (0, _escapeRegExp2.default)(trigger) + '[\\w]*', 'g'), contentBlock, callback);
  };
};