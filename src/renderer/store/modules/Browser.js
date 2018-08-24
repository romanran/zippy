import storage from 'electron-json-storage'

const state = {
  curr_dir: '.',
  files: []
}

const mutations = {
  setCWD(state, path) {
    storage.set('curr_dir', path, function(error) {
        if (error) throw error;
    });
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
