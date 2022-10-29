'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var fsExtra = require('fs-extra');
var upath2 = require('upath2');
var filenamify = require('filenamify');
var jestMatcherUtils = require('jest-matcher-utils');
var pathInDir = require('path-in-dir');
var findRoot = require('@yarn-tool/find-root');
var jestUtil = require('@lazy-assert/jest-util');
var jestDiff = require('@lazy-assert/jest-diff');

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
  return upath2.join(getBaseSnapshotDirectory(context), `${filenamify(context.currentTestName, {
    replacement: '-'
  }).replace(/\s/g, '-')}-${context.assertionCalls}`);
}
function _hintSnapshotFileName(context, snapshotFileName) {
  var _snapshotDisplayName2;
  const snapshotDirectory = getBaseSnapshotDirectory(context);
  let rootData;
  let snapshotDisplayName;
  let safeUpdateSnapshot;
  if (pathInDir.pathInsideDirectory(snapshotFileName, snapshotDirectory)) {
    snapshotDisplayName = upath2.relative(snapshotDirectory, snapshotFileName);
    safeUpdateSnapshot = true;
  } else {
    var _snapshotDisplayName, _context$snapshotStat, _context$snapshotStat2;
    rootData = findRoot.findRootLazy({
      cwd: context.testPath
    }, false);
    if (rootData) {
      if (pathInDir.pathInsideDirectory(snapshotFileName, rootData.pkg)) {
        snapshotDisplayName = upath2.relative(rootData.pkg, snapshotFileName);
        safeUpdateSnapshot = true;
      } else if (pathInDir.pathInsideDirectory(snapshotFileName, rootData.root)) {
        snapshotDisplayName = upath2.relative(rootData.root, snapshotFileName);
        safeUpdateSnapshot = true;
      }
    }
    if (!((_snapshotDisplayName = snapshotDisplayName) !== null && _snapshotDisplayName !== void 0 && _snapshotDisplayName.length) && (_context$snapshotStat = context.snapshotState) !== null && _context$snapshotStat !== void 0 && (_context$snapshotStat2 = _context$snapshotStat._rootDir) !== null && _context$snapshotStat2 !== void 0 && _context$snapshotStat2.length && pathInDir.pathInsideDirectory(snapshotFileName, context.snapshotState._rootDir)) {
      snapshotDisplayName = upath2.relative(context.snapshotState._rootDir, snapshotFileName);
      safeUpdateSnapshot = true;
    }
  }
  if (!((_snapshotDisplayName2 = snapshotDisplayName) !== null && _snapshotDisplayName2 !== void 0 && _snapshotDisplayName2.length)) {
    let rootData2 = findRoot.findRootLazy({
      cwd: upath2.dirname(snapshotFileName)
    }, false);
    if (rootData2 !== null && rootData2 !== void 0 && rootData2.pkg) {
      snapshotDisplayName = upath2.relative(upath2.resolve(rootData2.pkg, '..'), snapshotFileName);
    } else {
      snapshotDisplayName = snapshotFileName;
    }
  }
  safeUpdateSnapshot = safeUpdateSnapshot && snapshotFileName.includes('/__file_snapshots__/');
  return {
    snapshotFileName,
    snapshotDisplayName,
    rootData,
    safeUpdateSnapshot
  };
}
function toMatchFile(received, filepath, options = {}) {
  const {
    isNot,
    snapshotState
  } = this;
  const matcherName = 'toMatchFile';
  const snapshotFileName = upath2.normalize(filepath !== null && filepath !== void 0 ? filepath : getBaseSnapshotFileName(this));
  const {
    snapshotDisplayName,
    safeUpdateSnapshot
  } = _hintSnapshotFileName(this, snapshotFileName);
  options = {
    diff: Object.assign({}, _defaultDiffOptions, options.diff)
  };
  const optsMatcherHint = jestUtil.handleJestMatcherHintOptions(this);
  if (snapshotState._updateSnapshot === "none" && !fsExtra.pathExistsSync(snapshotFileName)) {
    snapshotState.unmatched++;
    return {
      pass: isNot,
      message: () => `New output file ${jestMatcherUtils.EXPECTED_COLOR(snapshotDisplayName)} was ${jestMatcherUtils.RECEIVED_COLOR('not written')}.\n\n` + 'The update flag must be explicitly passed to write a new snapshot.\n\n' + `This is likely because this test is run in a ${jestMatcherUtils.EXPECTED_COLOR('continuous integration (CI) environment')} in which snapshots are not written by default.\n\n`,
      actual: received,
      name: matcherName
    };
  }
  let pass = isNot;
  let message = () => jestMatcherUtils.matcherHint(matcherName, undefined, snapshotDisplayName, optsMatcherHint);
  let expected;
  if (fsExtra.pathExistsSync(snapshotFileName)) {
    expected = fsExtra.readFileSync(snapshotFileName, Buffer.isBuffer(received) ? null : 'utf8');
    if (isEqual(received, expected) !== isNot) {
      pass = !isNot;
    } else if (isNot) {
      snapshotState.unmatched++;
    } else {
      if (safeUpdateSnapshot && snapshotState._updateSnapshot === "all") {
        pass = !isNot;
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
  } else {
    if (safeUpdateSnapshot && !isNot && (snapshotState._updateSnapshot === "new" || snapshotState._updateSnapshot === "all")) {
      pass = !isNot;
      fsExtra.outputFileSync(snapshotFileName, received);
      snapshotState.added++;
    } else {
      snapshotState.unmatched++;
      message = () => `The output file ${jestMatcherUtils.EXPECTED_COLOR(snapshotDisplayName)} ${jestMatcherUtils.RECEIVED_COLOR("doesn't exist")}.`;
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
  if (Buffer.isBuffer(received) || Buffer.isBuffer(expected)) {
    return '';
  }
  return jestDiff._stringDiff(received, expected, options !== null && options !== void 0 ? options : _defaultDiffOptions);
}
var index = {
  toMatchFile
};

exports._diffHint = _diffHint;
exports._hintSnapshotFileName = _hintSnapshotFileName;
exports.default = index;
exports.getBaseSnapshotDirectory = getBaseSnapshotDirectory;
exports.getBaseSnapshotFileName = getBaseSnapshotFileName;
exports.toMatchFile = toMatchFile;
//# sourceMappingURL=index.cjs.development.cjs.map
