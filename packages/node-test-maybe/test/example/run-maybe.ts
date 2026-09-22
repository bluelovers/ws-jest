// 示範如何「用 `testMaybe` 寫測試」並「用 `runMaybe` 收集結果」。
//
// 執行方式（在套件根目錄）：
//   pnpm run demo
//
// `runMaybe` 會啟動測試執行器並透過 `--test-reporter` 收集結果，回傳一個結構化
// 的 summary；其中 `todo` 已經扣除 maybe 的數量（原始 `todo` 保留在 `rawTodo`）。
// 這裡對一個使用 `testMaybe` 定義的 fixture 跑 `runMaybe`。

import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

import { runMaybe } from '../../run.ts';

const here = dirname(fileURLToPath(import.meta.url));

// 這個 fixture 用 `testMaybe` 定義測試，與正式 API 一致。
const __root = join(here, '..', '..');

const files = [
	join(__root, 'test', 'fixtures', '*.ts'),
	join(__root, 'test', 'fixtures', '*.mjs'),
];

// 1) silent: true —— 只回傳結構化物件，由你自己決定怎麼使用。
const summary = await runMaybe({
	files,
}, {
	silent: true,
});

console.log('=== runMaybe 回傳的 JSON 摘要 (silent: true) ===');
console.log(JSON.stringify(summary, null, 2));

// 2) silent: false —— 直接印出精簡報表（與 `reporter.ts` 同一套 formatSummary）。
console.log('\n=== runMaybe 印出的精簡報表 (silent: false) ===');
await runMaybe({
	files,
}, {
	silent: false,
});

// 3) 用回傳值做流程控制：maybe 失敗是非阻斷的，只有硬失敗才讓程序失敗。
if (!summary.ok)
{
	process.exitCode = 1;
}
