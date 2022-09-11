'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var fsExtra = require('fs-extra');
var path = require('path');
var filenamify = require('filenamify');
var jestMatcherUtils = require('jest-matcher-utils');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var filenamify__default = /*#__PURE__*/_interopDefaultLegacy(filenamify);

exports.EnumUpdateSnapshot = void 0;

(function (EnumUpdateSnapshot) {
  EnumUpdateSnapshot["none"] = "none";
  EnumUpdateSnapshot["new"] = "new";
  EnumUpdateSnapshot["all"] = "all";
})(exports.EnumUpdateSnapshot || (exports.EnumUpdateSnapshot = {}));

function isEqual(a, b) {
  return Buffer.isBuffer(a) ? a.equals(b) : a === b;
}

function currentSnapshotFileName(context) {
  return path.join(path.dirname(context.testPath), '__file_snapshots__', `${filenamify__default["default"](context.currentTestName, {
    replacement: '-'
  }).replace(/\s/g, '-')}-${context.assertionCalls}`);
}
function toMatchFile(received, filepath, options = {}) {
  const {
    isNot,
    snapshotState
  } = this;
  const matcherName = 'toMatchFile';
  const snapshotFileName = filepath !== null && filepath !== void 0 ? filepath : currentSnapshotFileName(this);
  const snapshotBaseName = path.basename(snapshotFileName);
  options = {
    diff: Object.assign({
      expand: false,
      contextLines: 5,
      aAnnotation: `Snapshot`
    }, options.diff)
  };
  const optsMatcherHint = {
    isNot,
    promise: this.promise
  };

  if (snapshotState._updateSnapshot === "none" && !fsExtra.pathExistsSync(snapshotFileName)) {
    snapshotState.unmatched++;
    return {
      pass: isNot,
      message: () => `New output file ${jestMatcherUtils.EXPECTED_COLOR(snapshotBaseName)} was ${jestMatcherUtils.RECEIVED_COLOR('not written')}.\n\n` + 'The update flag must be explicitly passed to write a new snapshot.\n\n' + `This is likely because this test is run in a ${jestMatcherUtils.EXPECTED_COLOR('continuous integration (CI) environment')} in which snapshots are not written by default.\n\n`
    };
  }

  let pass = false;

  let message = () => jestMatcherUtils.matcherHint(matcherName, undefined, snapshotBaseName, optsMatcherHint);

  if (fsExtra.pathExistsSync(snapshotFileName)) {
    const expected = fsExtra.readFileSync(snapshotFileName, Buffer.isBuffer(received) ? null : 'utf8');

    if (isNot) {
      if (!isEqual(received, expected)) {
        pass = false;
      } else {
        snapshotState.unmatched++;
        pass = true;
      }
    } else {
      if (isEqual(received, expected)) {
        pass = true;
      } else {
        if (snapshotState._updateSnapshot === "all") {
          pass = true;
          fsExtra.outputFileSync(snapshotFileName, received);
          snapshotState.updated++;
        } else {
          snapshotState.unmatched++;
          const difference = Buffer.isBuffer(received) || Buffer.isBuffer(expected) ? '' : `\n\n${jestMatcherUtils.diff(expected, received, options.diff)}`;

          message = () => {
            return jestMatcherUtils.matcherHint(matcherName, undefined, snapshotBaseName, optsMatcherHint) + difference;
          };
        }
      }
    }
  } else {
    pass = true;

    if (!isNot && (snapshotState._updateSnapshot === "new" || snapshotState._updateSnapshot === "all")) {
      fsExtra.outputFileSync(snapshotFileName, received);
      snapshotState.added++;
    } else {
      snapshotState.unmatched++;

      message = () => `The output file ${jestMatcherUtils.EXPECTED_COLOR(path.basename(snapshotFileName))} ${jestMatcherUtils.RECEIVED_COLOR("doesn't exist")}.`;
    }
  }

  return {
    pass,
    message
  };
}
var index = {
  toMatchFile
};

exports.currentSnapshotFileName = currentSnapshotFileName;
exports["default"] = index;
exports.toMatchFile = toMatchFile;
//# sourceMappingURL=index.cjs.development.cjs.map
