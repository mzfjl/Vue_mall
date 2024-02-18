import { INIT_DATA } from './mutations-types.js'
export default {
  state: {
    list: []
  },
  getters: {
    defaultPath(state) {
      return state.list.filter((item) => {
        return item.isDefault == 1
      })
    }
  },
  mutations: {
    [INIT_DATA](state, arrPath) {
      state.list = arrPath
    }
  }
}
