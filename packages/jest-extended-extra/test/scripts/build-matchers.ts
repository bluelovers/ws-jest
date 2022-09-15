import FastGlob from '@bluelovers/fast-glob/bluebird';
import { join, parse } from 'path';
import { outputFile } from 'fs-extra';
import build from 'build-ts-file';
import { array_unique_overwrite } from 'array-hyper-unique';

const __root = join(__dirname, '../..')

FastGlob([
	'*.ts',
	'!*.d.ts',
], {
	cwd: join(__root, 'lib', 'matchers'),
})
	.then(async (ls) => {


		await FastGlob([
			'*/',
		], {
			cwd: join(__root, 'lib', 'matchers'),
			onlyDirectories: true,
		})
			.then(a => ls.push(...a))
		;

		array_unique_overwrite(ls);

		ls.sort();

		return ls
	})
.reduce((memo, item) => {

	const name = parse(item).name

	memo.push(name)

	return memo
}, [])
	.then(async (ls) => {

		let lines: string[] = [];
		let lines2: string[] = [];

		ls.forEach(line => {
			lines.push(`import ${line} from './matchers/${line}'`)
		})

		lines.push('');

		lines.push(`export const matchers = {\n${ls.map(v => `\t...${v}`).join(',\n')},\n} as const`);
		lines.push(`export default matchers`);

		let out = `\n\n${lines.join('\n')}\n\n`;

		await outputFile(join(__root, 'lib', 'matchers.ts'), out)

		await build(join(__root, 'lib', 'matchers.ts'), {
			verbose: true,
		})
	})
;
