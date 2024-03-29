import { toMatchFile } from '../src/index';
import { readFileSync } from 'fs';
import { join } from 'path';

expect.extend({ toMatchFile });

it('matches content of file on disk with specified filename', () => {
  expect(`# this is a test`).toMatchFile(
    join(__dirname, '..', '__fixtures__', 'output.md')
  );
});

it('matches content of file on disk without filename', () => {
  expect(`# this is a another test`).toMatchFile();
});

it('matches binary content of file on disk', () => {
  expect(
    readFileSync(join(__dirname, 'minimal.pdf'), 'binary')
  ).toMatchFile();
});

it('works with non-binary buffer content', () => {
  expect(new Buffer('# this is a buffer test')).toMatchFile();
});

it('works with .not', () => {
  expect(`# this is a nice test`).not.toMatchFile();
});

it('works with .not for binary files', () => {
  expect(
    readFileSync(join(__dirname, 'minimal.pdf'), 'binary')
  ).not.toMatchFile();
});
