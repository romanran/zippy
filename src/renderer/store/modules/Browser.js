const state = {
  curr_dir: '.',
  files: []
}

const mutations = {
  setCWD(state, path) {
    state.curr_dir = path
  },
}

const actions = {
}

export default {
  state,
  mutations,
  actions
}
