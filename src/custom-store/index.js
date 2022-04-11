import Vue from 'vue'
import Vuex from './custom-vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    count: 1
  },
  getters: {
    getterCount (state) {
      return state.count * 3
    }
  },
  mutations: {
    ADD (state) {
      state.count++
    }
  },
  actions: {
    add({ commit }) {
      setTimeout(() => {
        commit('ADD')
      }, 1000)
    }
  },
  modules: {
  }
})
