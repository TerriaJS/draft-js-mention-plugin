'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash.escaperegexp');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var findWithRegex = function findWithRegex(regex, contentBlock, callback) {
  var contentBlockText = contentBlock.getText();

  // exclude entities, when matching
  contentBlock.findEntityRanges(function (character) {
    return !character.getEntity();
  }, function (nonEntityStart, nonEntityEnd) {
    var text = contentBlockText.slice(nonEntityStart, nonEntityEnd);
    var matchArr = void 0;
    var start = void 0;

    // Go through all matches in the text and return the indices to the callback
    while ((matchArr = regex.exec(text)) !== null) {
      // eslint-disable-line
      start = nonEntityStart + matchArr.index;
      callback(start, start + matchArr[0].length);
    }
  });
};

exports.default = function (trigger, regExp) {
  return function (contentBlock, callback) {
    findWithRegex(new RegExp('(\\s|^)' + (0, _lodash2.default)(trigger) + regExp, 'g'), contentBlock, callback);
  };
};