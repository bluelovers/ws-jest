'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var fsExtra = require('fs-extra');
var path = require('path');
var filenamify = require('filenamify');
var jestMatcherUtils = require('jest-matcher-utils');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var filenamify__default = /*#__PURE__*/_interopDefaultLegacy(filenamify);

function isEqual(a, b) {
  return Buffer.isBuffer(a) ? a.equals(b) : a === b;
}

function toMatchFile(content, filepath, options = {}) {
  const {
    isNot,
    snapshotState
  } = this;
  const filename = filepath !== null && filepath !== void 0 ? filepath : path.join(path.dirname(this.testPath), '__file_snapshots__', `${filenamify__default["default"](this.currentTestName, {
    replacement: '-'
  }).replace(/\s/g, '-')}-${this.assertionCalls}`);
  options = {
    diff: Object.assign({
      expand: false,
      contextLines: 5,
      aAnnotation: 'Snapshot'
    }, options.diff)
  };

  if (snapshotState._updateSnapshot === 'none' && !fsExtra.existsSync(filename)) {
    snapshotState.unmatched++;
    return {
      pass: isNot,
      message: () => `New output file ${jestMatcherUtils.EXPECTED_COLOR(path.basename(filename))} was ${jestMatcherUtils.RECEIVED_COLOR('not written')}.\n\n` + 'The update flag must be explicitly passed to write a new snapshot.\n\n' + `This is likely because this test is run in a ${jestMatcherUtils.EXPECTED_COLOR('continuous integration (CI) environment')} in which snapshots are not written by default.\n\n`
    };
  }

  if (fsExtra.existsSync(filename)) {
    const output = fsExtra.readFileSync(filename, Buffer.isBuffer(content) ? null : 'utf8');

    if (isNot) {
      if (!isEqual(content, output)) {
        return {
          pass: false,
          message: () => ''
        };
      } else {
        snapshotState.unmatched++;
        return {
          pass: true,
          message: () => `Expected received content ${jestMatcherUtils.RECEIVED_COLOR('to not match')} the file ${jestMatcherUtils.EXPECTED_COLOR(path.basename(filename))}.`
        };
      }
    } else {
      if (isEqual(content, output)) {
        return {
          pass: true,
          message: () => ''
        };
      } else {
        if (snapshotState._updateSnapshot === 'all') {
          fsExtra.outputFileSync(filename, content);
          snapshotState.updated++;
          return {
            pass: true,
            message: () => ''
          };
        } else {
          snapshotState.unmatched++;
          const difference = Buffer.isBuffer(content) || Buffer.isBuffer(output) ? '' : `\n\n${jestMatcherUtils.diff(output, content, options.diff)}`;
          return {
            pass: false,
            message: () => `Received content ${jestMatcherUtils.RECEIVED_COLOR("doesn't match")} the file ${jestMatcherUtils.EXPECTED_COLOR(path.basename(filename))}.${difference}`
          };
        }
      }
    }
  } else {
    if (!isNot && (snapshotState._updateSnapshot === 'new' || snapshotState._updateSnapshot === 'all')) {
      fsExtra.outputFileSync(filename, content);
      snapshotState.added++;
      return {
        pass: true,
        message: () => ''
      };
    } else {
      snapshotState.unmatched++;
      return {
        pass: true,
        message: () => `The output file ${jestMatcherUtils.EXPECTED_COLOR(path.basename(filename))} ${jestMatcherUtils.RECEIVED_COLOR("doesn't exist")}.`
      };
    }
  }
}
var index = {
  toMatchFile
};

exports["default"] = index;
exports.toMatchFile = toMatchFile;
//# sourceMappingURL=index.cjs.development.cjs.map
