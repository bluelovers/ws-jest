# Agent Guidelines

## Testing

When running Jest tests, always use the following flags:

```bash
jest --passWithNoTests --no-colors -u
```

- `--no-colors` - Disable color output
- `-u` - Update snapshots

or

`pnpm run test:jest:snapshot`
如果需要追加參數則是 `pnpm run test:jest:snapshot -- xxx`
