import { applyStyleBorderless, Table } from '@yarn-tool/table';
import { TableConstructorOptions } from 'cli-table3';
import { InitialOptionsTsJest } from 'ts-jest';
import { console } from 'debug-color2';
import { inspect } from 'util';
import { name as jName, version as jVersion } from '../package.json';

export function _newTableBorderless(options?: TableConstructorOptions)
{
	let table = new Table({
		colAligns: ['right', 'left'],
		//colAligns: ['left', 'center', 'center', 'center'],
		chars: {
			top: '',
			'top-mid': '',
			'top-left': '',
			'top-right': '',
			bottom: '',
			'bottom-mid': '',
			'bottom-left': '',
			'bottom-right': '',
			left: '',
			'left-mid': '',
			mid: '',
			'mid-mid': '',
			right: '',
			'right-mid': '',
			middle: '',
		},
		...options,
	});

	table = applyStyleBorderless(table);

	return table;
}

export interface IOptionsPrintJestConfigInfo
{
	cwd?: string;
	file?: string;
}

export function printJestConfigInfo(jestConfig: InitialOptionsTsJest, options?: IOptionsPrintJestConfigInfo)
{
	const table = _newTableBorderless();

	options ??= {};
	// @ts-ignore
	jestConfig ??= {};

	table.push([`${jName}:`, jVersion]);
	table.push(['cwd:', options.cwd ?? process.cwd()]);

	options.file?.length && table.push(['file:', options.file]);

	jestConfig.cacheDirectory?.length && table.push(['cacheDirectory:', jestConfig.cacheDirectory]);

	jestConfig.rootDir?.length && table.push(['rootDir:', jestConfig.rootDir]);
	jestConfig.roots?.length && table.push(['roots:', inspect(jestConfig.roots)]);

	jestConfig.preset?.length && table.push(['preset:', jestConfig.preset]);

	console.gray.log('─'.repeat(20));
	console.log(`jest.config`);
	console.log(table.toString());
	console.gray.log('─'.repeat(20));
}
