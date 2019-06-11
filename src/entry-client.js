import Vue from 'vue'
import { createApp } from './app'
const { app, router, store } = createApp()
import {
  getLocation,
  flatMapComponents,
  applyAsyncData,
  setContext,
  promisify,
  sanitizeComponent
} from '../utils'


function applySSRData(Component, ssrData) {
  if (window.__INITIAL_STATE__ && ssrData) {
    applyAsyncData(Component, ssrData)
  }
  Component._Ctor = Component
  return Component
}

// Get matched components
function resolveComponents(router) {
  const path = getLocation(router.options.base, router.options.mode)

  return flatMapComponents(router.match(path), async (Component, _, match, key, index) => {
    // If component is not resolved yet, resolve it
    if (typeof Component === 'function' && !Component.options) {
      Component = await Component()
    }
    // Sanitize it and save it
    const _Component = applySSRData(sanitizeComponent(Component), window.__INITIAL_STATE__.data ? window.__INITIAL_STATE__.data[index] : null)
    match.components[key] = _Component
    return _Component
  })
}


if (window.__INITIAL_STATE__) {
  store.replaceState(window.__INITIAL_STATE__)
}

router.onReady(async () => {
  // Add router hook for handling asyncData.
  // Doing it after initial route is resolved so that we don't double-fetch the data that we already have. // Using `router.beforeResolve()` so that all async components are resolved.
  const Components = await Promise.all(resolveComponents(router))
  router.beforeResolve(async (to, from, next) => {
    const matched = router.getMatchedComponents(to)
    const prevMatched = router.getMatchedComponents(from)

    // we only care about non-previously-rendered components,
    // so we compare them until the two matched lists differ
    let diffed = false
    const activated = matched.filter((c, i) => {
      return diffed || (diffed = (prevMatched[i] !== c))
    })

    if (!activated.length) {
      return next()
    }

    await setContext(app, {
      route: router.currentRoute,
      isHMR: true,
      next: next.bind(this)
    })
    const context = app.context
    const promises = []
    // this is where we should trigger a loading indicator if there is one
    Promise.all(activated.map(Component => {
      if (Component.asyncData) {
        Component = sanitizeComponent(Component)
        let promise = promisify(Component.options.asyncData, {
          store,
          route: router.currentRoute,
          cookies: context.cookies,
        }).then((asyncDataResult) => {
          applySSRData(Component, asyncDataResult)
        })
        promises.push(promise)
        return Promise.all(promises)
      }
    })).then(() => {
      // stop loading indicator
      next()
    }).catch(next)
  })
  app.$mount('#app')
})
