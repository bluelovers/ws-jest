# @lazy-assert/jest-global-types-extra

Jest 全域類型擴展，提供自定義匹配器結果和 Snapshot 狀態的型別定義。

Jest global type extensions providing type definitions for custom matcher results and Snapshot states.

## 特色 (Features)

- 擴展 Jest 全域類型 / Extends Jest global types
- 提供自定義匹配器結果介面 / Provides custom matcher result interfaces
- 支援 Snapshot 狀態類型 / Supports Snapshot state types
- 相容 expect 模組 / Compatible with expect module

## 安裝 (Installation)

```bash
npm install @lazy-assert/jest-global-types-extra
# or
yarn add @lazy-assert/jest-global-types-extra
```

## 使用方式 (Usage)

```typescript
import { IMatcherContext, ICustomMatcherResult, ISnapshotState } from '@lazy-assert/jest-global-types-extra';

// 在自定義匹配器中使用 / Use in custom matchers
function myMatcher(this: IMatcherContext, received: any): ICustomMatcherResult {
  return {
    pass: true,
    message: () => 'passed',
    actual: received,
    expected: 'expected',
    name: 'myMatcher'
  };
}
```

## API 參考 (API Reference)

### 類型匯出 (Type Exports)

| 類型 (Type) | 說明 (Description) |
|------------|-------------------|
| `ICustomMatcherResult` | 自定義匹配器結果 / Custom matcher result |
| `ICustomMatcherResultRequired` | 必填的匹配器結果 / Required matcher result |
| `IMatcherContext` | 匹配器上下文 / Matcher context |
| `IExpectExtendMap` | Expect 擴展映射 / Expect extend map |
| `ISnapshotState` | Snapshot 狀態 / Snapshot state |

### 列舉 (Enum)

| 列舉 (Enum) | 說明 (Description) |
|------------|-------------------|
| `EnumUpdateSnapshot` | Snapshot 更新模式 / Snapshot update mode |

## 授權 (License)

ISC
