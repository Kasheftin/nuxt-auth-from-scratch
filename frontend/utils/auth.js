import axios from 'axios'

export function setAuthToken (token) {
  axios.defaults.headers.common['x-access-token'] = token
}

export function resetAuthToken () {
  delete axios.defaults.headers.common['x-access-token']
}
