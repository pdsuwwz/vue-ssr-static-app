Vue SSR 渲染，对 SEO 友好

## 使用技术：

> Vue2 + VueRouter3 + Vuex3 + Webpack4 + Babel7 + express

* [x] 项目热部署
* [-] 运行环境区分
* [ ] bundle 文件彻底分片
* [ ] 清理控制台中不必要的信息

## 开发文档：

```
// 安装依赖 ( or npm )
yarn install

// 本地开发环境（热部署）
yarn dev

// 本地模拟生产环境（无热部署）
yarn dev:prod
```

### 在本地中测试时，要注意，若在开发环境与生产环境之间切换，可能导致缓存遗留，请尝试强制刷新页面以保证访问的是最新代码。
