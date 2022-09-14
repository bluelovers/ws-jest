'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var fsExtra = require('fs-extra');
var upath2 = require('upath2');
var filenamify = require('filenamify');
var jestMatcherUtils = require('jest-matcher-utils');
var crlfNormalize = require('crlf-normalize');
var pathInDir = require('path-in-dir');
var findRoot = require('@yarn-tool/find-root');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var filenamify__default = /*#__PURE__*/_interopDefaultLegacy(filenamify);

exports.EnumUpdateSnapshot = void 0;

(function (EnumUpdateSnapshot) {
  EnumUpdateSnapshot["none"] = "none";
  EnumUpdateSnapshot["new"] = "new";
  EnumUpdateSnapshot["all"] = "all";
})(exports.EnumUpdateSnapshot || (exports.EnumUpdateSnapshot = {}));

const _defaultDiffOptions = {
  expand: false,
  contextLines: 5,
  aAnnotation: `Snapshot`
};

function isEqual(a, b) {
  return Buffer.isBuffer(a) ? a.equals(b) : a === b;
}

function getBaseSnapshotDirectory(context) {
  return upath2.join(upath2.dirname(context.testPath), '__file_snapshots__');
}
function getBaseSnapshotFileName(context) {
  return upath2.join(getBaseSnapshotDirectory(context), `${filenamify__default["default"](context.currentTestName, {
    replacement: '-'
  }).replace(/\s/g, '-')}-${context.assertionCalls}`);
}
function _hintSnapshotFileName(context, snapshotFileName) {
  var _snapshotDisplayName;

  const snapshotDirectory = getBaseSnapshotDirectory(context);
  let rootData;
  let snapshotDisplayName;

  if (pathInDir.pathInsideDirectory(snapshotFileName, snapshotDirectory)) {
    snapshotDisplayName = upath2.relative(snapshotDirectory, snapshotFileName);
  } else {
    rootData = findRoot.findRootLazy({
      cwd: context.testPath
    }, false);

    if (rootData) {
      if (pathInDir.pathInsideDirectory(snapshotFileName, rootData.pkg)) {
        snapshotDisplayName = upath2.relative(rootData.pkg, snapshotFileName);
      } else if (pathInDir.pathInsideDirectory(snapshotFileName, rootData.root)) {
        snapshotDisplayName = upath2.relative(rootData.root, snapshotFileName);
      }
    }
  }

  if (!((_snapshotDisplayName = snapshotDisplayName) !== null && _snapshotDisplayName !== void 0 && _snapshotDisplayName.length)) {
    let rootData2 = findRoot.findRootLazy({
      cwd: upath2.dirname(snapshotFileName)
    }, false);

    if (rootData2 !== null && rootData2 !== void 0 && rootData2.pkg) {
      snapshotDisplayName = upath2.relative(upath2.resolve(rootData2.pkg, '..'), snapshotFileName);
    } else {
      snapshotDisplayName = snapshotFileName;
    }
  }

  return {
    snapshotFileName,
    snapshotDisplayName,
    rootData
  };
}
function toMatchFile(received, filepath, options = {}) {
  const {
    isNot,
    snapshotState
  } = this;
  const matcherName = 'toMatchFile';
  const snapshotFileName = filepath !== null && filepath !== void 0 ? filepath : getBaseSnapshotFileName(this);

  const snapshotDisplayName = _hintSnapshotFileName(this, snapshotFileName).snapshotDisplayName;

  options = {
    diff: Object.assign({}, _defaultDiffOptions, options.diff)
  };
  const optsMatcherHint = {
    isNot,
    promise: this.promise
  };

  if (snapshotState._updateSnapshot === "none" && !fsExtra.pathExistsSync(snapshotFileName)) {
    snapshotState.unmatched++;
    return {
      pass: isNot,
      message: () => `New output file ${jestMatcherUtils.EXPECTED_COLOR(snapshotDisplayName)} was ${jestMatcherUtils.RECEIVED_COLOR('not written')}.\n\n` + 'The update flag must be explicitly passed to write a new snapshot.\n\n' + `This is likely because this test is run in a ${jestMatcherUtils.EXPECTED_COLOR('continuous integration (CI) environment')} in which snapshots are not written by default.\n\n`,
      actual: received,
      name: matcherName
    };
  }

  let pass = false;

  let message = () => jestMatcherUtils.matcherHint(matcherName, undefined, snapshotDisplayName, optsMatcherHint);

  let expected;

  if (fsExtra.pathExistsSync(snapshotFileName)) {
    expected = fsExtra.readFileSync(snapshotFileName, Buffer.isBuffer(received) ? null : 'utf8');

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

          const difference = _diffHint(expected, received, options.diff);

          message = () => {
            return jestMatcherUtils.matcherHint(matcherName, undefined, snapshotDisplayName, optsMatcherHint) + difference;
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

      message = () => `The output file ${jestMatcherUtils.EXPECTED_COLOR(upath2.basename(snapshotFileName))} ${jestMatcherUtils.RECEIVED_COLOR("doesn't exist")}.`;
    }
  }

  return {
    pass,
    message,
    actual: received,
    expected,
    name: matcherName
  };
}
function _diffHint(received, expected, options) {
  var _options;

  if (Buffer.isBuffer(received) || Buffer.isBuffer(expected)) {
    return '';
  }

  (_options = options) !== null && _options !== void 0 ? _options : options = _defaultDiffOptions;
  let difference = [''];

  if (crlfNormalize.crlf(expected) === crlfNormalize.crlf(received)) {
    difference.push(`Contents have differences only in line separators`);
    difference.push(jestMatcherUtils.diff(crlfNormalize.chkcrlf(expected), crlfNormalize.chkcrlf(received)));
  } else {
    difference.push(jestMatcherUtils.diff(expected, received, options));
  }

  return difference.join("\n" + "\n");
}
var index = {
  toMatchFile
};

exports._diffHint = _diffHint;
exports._hintSnapshotFileName = _hintSnapshotFileName;
exports["default"] = index;
exports.getBaseSnapshotDirectory = getBaseSnapshotDirectory;
exports.getBaseSnapshotFileName = getBaseSnapshotFileName;
exports.toMatchFile = toMatchFile;
//# sourceMappingURL=index.cjs.development.cjs.map
