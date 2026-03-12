# README.md



## 安裝 (Installation)

```bash
# 使用 yarn / Using yarn
yarn add @lazy-assert/jest-expect-matcher

# 使用 yarn-tool / Using yarn-tool
yarn-tool add @lazy-assert/jest-expect-matcher
# yt 是 yarn-tool 的別名 / yt is an alias for yarn-tool
yt add @lazy-assert/jest-expect-matcher

# 使用 pnpm / Using pnpm
pnpm add @lazy-assert/jest-expect-matcher

# 使用 npm / Using npm
npm install @lazy-assert/jest-expect-matcher
```

## API Usage

### anyOf

Matches if any of the given matchers matches (OR logic).

```typescript
import { anyOf } from '@lazy-assert/jest-expect-matcher';

// Nullable String
expect(value).toMatchObject({
  name: anyOf([expect.any(String), null])
});

// Optional Number
expect(value).toMatchObject({
  count: anyOf([expect.any(Number), undefined])
});
```

### allOf

Matches if all of the given matchers match (AND logic).

```typescript
import { allOf } from '@lazy-assert/jest-expect-matcher';

expect(value).toMatchObject({
  version: allOf([
    expect.any(String),
    expect.stringMatching(/^3\./)
  ])
});
```

