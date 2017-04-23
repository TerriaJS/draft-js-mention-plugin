import { expect } from 'chai';
import sinon from 'sinon';
import { genKey, convertFromRaw } from 'draft-js';
import mentionSuggestionsStrategy from '../mentionSuggestionsStrategy';
import defaultRegExp from '../defaultRegExp'
let callback;
const trigger = '@';
const nonWhitespaceStrategy = mentionSuggestionsStrategy(trigger, defaultRegExp);
const whitespaceStrategy = mentionSuggestionsStrategy(trigger, '[\\w\\s]{0,20}');

const getBlock = (text, entityRanges = [], entityMap = {}) => {
  const contentState = convertFromRaw({
    blocks: [{
      key: genKey(),
      text,
      type: 'unstyled',
      depth: 0,
      inlineStyleRanges: [],
      entityRanges,
    }],
    entityMap,
  });
  return contentState.getFirstBlock();
};

describe('mentionSuggestionsStrategy', () => {
  beforeEach(() => {
    callback = sinon.spy();
  });

  context('when whitespace support is disabled', () => {
    it('should match a word', () => {
      nonWhitespaceStrategy(getBlock('@the'), callback);
      expect(callback.callCount).to.equal(1);
      expect(callback.lastCall.args).to.deep.equal([0, 4]);
    });

    it('should match not match spaces', () => {
      nonWhitespaceStrategy(getBlock('@the walking dead'), callback);
      expect(callback.callCount).to.equal(1);
      expect(callback.lastCall.args).to.deep.equal([0, 4]);
    });

    it('should match multiple mentions', () => {
      nonWhitespaceStrategy(getBlock('@the @walking @dead'), callback);
      expect(callback.callCount).to.equal(3);
      expect(callback.firstCall.args).to.deep.equal([0, 4]);
      expect(callback.secondCall.args).to.deep.equal([4, 13]);
      expect(callback.thirdCall.args).to.deep.equal([13, 19]);
    });
  });

  context('when whitespace support is enabled', () => {
    it('should match a word', () => {
      whitespaceStrategy(getBlock('@the'), callback);
      expect(callback.callCount).to.equal(1);
      expect(callback.lastCall.args).to.deep.equal([0, 4]);
    });

    it('should match a word trailing space', () => {
      whitespaceStrategy(getBlock('@the '), callback);
      expect(callback.callCount).to.equal(1);
      expect(callback.lastCall.args).to.deep.equal([0, 5]);
    });

    it('should match only 20 characters', () => {
      whitespaceStrategy(getBlock('@the walking dead tv show'), callback);
      expect(callback.callCount).to.equal(1);
      expect(callback.lastCall.args).to.deep.equal([0, 21]);

      whitespaceStrategy(getBlock('@the walking dead tv '), callback);
      expect(callback.lastCall.args).to.deep.equal([0, 21]);
    });

    it('should match multiple mentions with spaces', () => {
      whitespaceStrategy(getBlock('@the walking dead tv and @the white house'), callback);
      expect(callback.callCount).to.equal(2);
      expect(callback.firstCall.args).to.deep.equal([0, 21]);
      expect(callback.secondCall.args).to.deep.equal([24, 41]);
    });

    it('should not match entities', () => {
      const key = genKey();
      whitespaceStrategy(getBlock(
        '@the walking dead tv and @the white house',
        [{
          key,
          offset: 24,
          length: 15,
        }],
        {
          [key]: {
            type: 'mention',
            mutability: 'IMMUTABLE',
            data: {},
          },
        },
      ), callback);
      expect(callback.callCount).to.equal(1);
      expect(callback.firstCall.args).to.deep.equal([0, 21]);
    });
  });
});
