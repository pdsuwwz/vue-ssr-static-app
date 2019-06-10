import { createApp } from './app'
import { sanitizeComponent, applyAsyncData, promisify } from '../utils'

export default context => {
    return new Promise((resolve, reject) => {
        const { app, router, store } = createApp()
        router.push(context.url)

        router.onReady(() => {
            const matchedComponents = router.getMatchedComponents()
            // 匹配不到的路由，执行 reject 函数，并返回 404
            if (!matchedComponents.length) {
                return reject({ code: 404 })
            }

            // 执行所有组件的 asyncData 方法, 从而预期数据
            context.asyncData = {}
            Promise.all(matchedComponents.map(Component => {
                if (Component.asyncData) {
                    Component = sanitizeComponent(Component)
                    let promise = promisify(Component.options.asyncData, {
                        store,
                        route: router.currentRoute,
                        cookies: context.cookies,
                    })
                    return promise.then((asyncDataResult) => {
                        context.asyncData[Component.cid] = asyncDataResult
                        applyAsyncData(Component)
                        return context.asyncData[Component.cid]
                    })
                }
            })).then((data) => {
                // 在所有预取钩子(preFetch hook) resolve 后，
                // 我们的 store 现在已经填充入渲染应用程序所需的状态。
                // 当我们将状态附加到上下文，
                // 并且 `template` 选项用于 renderer 时，
                // 状态将自动序列化为 `window.__INITIAL_STATE__`，并注入 HTML。
                context.state = store.state
                context.state.data = data
                //Promise 应该 resolve 应用程序实例，以便它可以渲染
                resolve(app)
            })
        }, reject)
    })
}
