import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export function createStore() {
  return new Vuex.Store({
    state: {
      text: 'Hello Vue!'
    },
    mutations: {
      setText: (state, payload) => {
        state.text = payload
      }
    },
    actions: {
      setText: (context, text) => {
        context.commit('setText', text)
      }
    }
  })
}
