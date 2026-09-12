# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## 1.0.1 (2026-09-12)


### BREAKING CHANGES

* **jest-expect-matcher:** anyOf 和 allOf 函式現在接受陣列參數而非擴展參數
- anyOf(expect.any(String), null, undefined) → anyOf([expect.any(String), null, undefined])
- allOf(expect.any(String), expect.stringMatching(/^2\./)) → allOf([expect.any(String), expect.stringMatching(/^2\./)])

此改動改善了類型安全性和 API 一致性。測試檔案已同步更新。



### ✨　Features

* **@lazy-assert/jest-expect-matcher:** add AGENTS.md with jest test guidelines ([1254097](https://github.com/bluelovers/ws-jest/commit/125409793dc62f8662bd5ffdd0d47732500fc8ae))
* **jest-expect-matcher:** add Jest AsymmetricMatcher-based AnyOf and AllOf matchers ([9e8cbd6](https://github.com/bluelovers/ws-jest/commit/9e8cbd6bba56af9a85860514bd194935e8d103e2))
* **jest-expect-matcher:** add class-based AnyOf and AllOf matchers ([f76a1b0](https://github.com/bluelovers/ws-jest/commit/f76a1b0fa6af0001157cc84ad22d8657c0320506))


### 📦　Code Refactoring

* **jest-expect-matcher:** separate toString and toAsymmetricMatcher for AsymmetricMatcher classes ([0387e1c](https://github.com/bluelovers/ws-jest/commit/0387e1ca92c3196e0912902070a42835ad07ad19))
* **jest-expect-matcher:** rename test files for throw-msg consistency ([d6773ab](https://github.com/bluelovers/ws-jest/commit/d6773ab1ae0b6f353b4477592cf8a59e9ce42303))
* **jest-expect-matcher:** move test reference files from temp to ref ([a35932e](https://github.com/bluelovers/ws-jest/commit/a35932ea7a5e55249c3e50fcaf57b7f0f6f6935d))
* **jest-expect-matcher:** 改變 anyOf 和 allOf 函式參數為陣列格式 ([29477de](https://github.com/bluelovers/ws-jest/commit/29477dec8763604cf7b1ba5027e50ac2a7bee634))


### 📚　Documentation

* update README with test analysis references ([2903a42](https://github.com/bluelovers/ws-jest/commit/2903a42b55feeddbe71d603b39deac5333a16b1e))
* **@lazy-assert/jest-expect-matcher:** 更新 .gitignore 和補充範例註解 ([c3ce16a](https://github.com/bluelovers/ws-jest/commit/c3ce16ae991485ad2236aea38d7700d8704973f7))
* **@lazy-assert/jest-expect-matcher:** add Jest asymmetric matchers source code analysis document ([d7e98c6](https://github.com/bluelovers/ws-jest/commit/d7e98c656a1b4f0fd6c4ccd8dc70e0e62a85cb8e))
* **asymmetricMatchers:** add bilingual comments to source code ([501bb98](https://github.com/bluelovers/ws-jest/commit/501bb98a2625439f9ec07c45db2d51e09309d7ea))
* **jest-expect-matcher:** add toString vs toAsymmetricMatcher design section to README ([81d0c61](https://github.com/bluelovers/ws-jest/commit/81d0c6180c13e891dc76494d2b1794fb23af6c92))
* **jest-expect-matcher:** add Jest assertion system analysis document ([7c6e880](https://github.com/bluelovers/ws-jest/commit/7c6e88067484951281ec693b3c59034b2c4c2232))


### 🚨　Tests

* **@lazy-assert/jest-expect-matcher:** 新增 snapshot 檔案並重構測試結構 ([d371e65](https://github.com/bluelovers/ws-jest/commit/d371e6577c229db949e2e29f080d4bd4c81ed652))
* **@lazy-assert/jest-expect-matcher:** 擴充自訂非對稱匹配器的測試覆蓋率 ([4f01d13](https://github.com/bluelovers/ws-jest/commit/4f01d13baa87cd3347c4f6cf007ab5dd32744707))
* **@lazy-assert/jest-expect-matcher:** 优化自定义匹配器测试并修订错误信息 ([977c90a](https://github.com/bluelovers/ws-jest/commit/977c90a61278038cb293f26612a1b435bb4dd5ac))
* **@lazy-assert/jest-expect-matcher:** 新增測試自訂非對稱匹配器訊息控制 ([541ace0](https://github.com/bluelovers/ws-jest/commit/541ace081e78ade37a9cf1b8c214cdc9d7578fce))
* **@lazy-assert/jest-expect-matcher:** 重构测试文件并拆分自定义匹配器逻辑 ([f6a4944](https://github.com/bluelovers/ws-jest/commit/f6a4944ce8251ffd03a46132c9d782d168c70937))
* **@lazy-assert/jest-expect-matcher:** 添加自定义非对称匹配器的测试用例和配置 ([04113e8](https://github.com/bluelovers/ws-jest/commit/04113e806831b0d6fca05a01ff2f84cce3c637b2))


### 🛠　Build System

* 升級開發工具鏈與優化 monorepo 配置 ([d5ec02d](https://github.com/bluelovers/ws-jest/commit/d5ec02de7c66ab9cc1ebbe693e9708c561c68c53))


### 🔖　Miscellaneous

* . ([e93d019](https://github.com/bluelovers/ws-jest/commit/e93d019e665e5d65bae5536f00e8c57f80ed77df))
* . ([befac96](https://github.com/bluelovers/ws-jest/commit/befac96bb0c94ad5fb78c5221af6355850ed1312))
* **@lazy-assert/jest-expect-matcher:** 初始化项目并添加核心功能 ([c297f0c](https://github.com/bluelovers/ws-jest/commit/c297f0cf601f473eb00242b8a5d8c1827fb31a09))
