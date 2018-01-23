import axios from 'axios'

export default {
  auth: {
    me: () => axios.get('auth/me'),
    login: (data) => axios.post('auth/login', data),
    google: (data) => axios.post('auth/google', data)
  }
}
