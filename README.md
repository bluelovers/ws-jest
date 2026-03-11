# ws-jest

Jest 相關測試工具集合，包含多個 Jest 擴充套件和斷言工具。

## 特色

- 提供多種 Jest 匹配器擴充
- 整合 Chai 斷言庫
- 支援 TypeScript 開發
- 包含測試工具和效能優化

## 使用方式

詳細使用方式請參閱各子模組的 README 文件。

## 目錄結構

```
packages/
├── @bluelovers/jest-config/     # Jest 配置工具
├── @lazy-assert/               # 懶惰斷言工具
├── @lazy-assert/check-basic/   # 基本檢查工具
├── @lazy-assert/jest-diff/     # Jest 差異比較
├── @lazy-assert/jest-global-types-extra/ # 額外類型定義
├── @lazy-assert/jest-util/     # Jest 工具函式
├── chai-asserttype-extra/      # Chai 類型斷言擴充
├── expect-print-close-to/      # Expect 輸出比較
├── jest-cache-directory/       # Jest 快取目錄工具
├── jest-extended-extra/        # Jest 擴充額外功能
├── jest-file-snapshot/         # 檔案快照測試
├── jest-install-matcher-extends/ # 安裝匹配器擴充
├── jest-num-close-with/        # 數字接近比較
└── jest-num-close-with/        # 數字接近比較
```

## 授權

MIT