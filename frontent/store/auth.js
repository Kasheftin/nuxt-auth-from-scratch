import api from '~/api'

export const state = () => ({
  user: null
})

export const mutations = {
  set_user (store, data) {
    store.user = data
  },
  reset_user (store) {
    store.user = null
  }
}

export const actions = {
  fetch ({commit}) {
    return api.auth.me()
      .then(response => {
        commit('set_user', response.data)
        return response
      })
      .catch(error => {
        commit('reset_user')
        return error
      })
  },
  login ({commit}, data) {
    return api.auth.login(data)
      .then(response => {
        commit('set_user', response.data.user)
        return response
      })
  },
  reset ({commit}) {
    commit('reset_user')
    return Promise.resolve()
  }
}
