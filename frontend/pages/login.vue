<template>
  <v-layout justify-center align-center>
    <v-card class="elevation-10" style="flex: 0 1 400px">
      <v-card-title class="headline">Log In</v-card-title>
      <v-card-text>
        <v-form @submit.prevent="submit">
          <v-alert v-if="alert" :type="alert.type" value="true">{{alert.message}}</v-alert>
          <v-text-field label="Email" v-model="email"></v-text-field>
          <v-text-field label="Password" v-model="password" type="password"></v-text-field>
          <v-btn type="submit" :loading="loading" :disabled="loading">Log In</v-btn>
          <v-btn color="red white--text" v-if="google_ready" @click="google_submit" :loading="google_loading" :disabled="google_loading">Log in with Google</v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-layout>
</template>

<script>
import {googleClientId} from '~/config'

export default {
  layout: 'fullscreen',
  data () {
    return {
      email: '',
      password: '',
      alert: null,
      loading: false,
      google_loading: false,
      google_ready: false
    }
  },
  mounted () {
    window.gapiOnLoadCallback = () => {
      window.gapi.load('auth2', () => {
        window.google_auth2 = window.gapi.auth2.init({
          client_id: googleClientId,
          fetch_basic_profile: false,
          scope: 'profile email'
        })
      })
      this.google_ready = true
    }
    const installGoogleSdkScript = (d, s, id) => {
      if (d.getElementById(id)) {
        this.google_ready = true
        return
      }
      let fjs = d.getElementsByTagName(s)[0]
      let js = d.createElement(s)
      js.id = id
      js.src = 'https://apis.google.com/js/platform.js?onload=gapiOnLoadCallback'
      fjs.parentNode.insertBefore(js, fjs)
    }
    installGoogleSdkScript(document, 'script', 'google-jssdk')
  },
  methods: {
    submit () {
      this.alert = null
      this.loading = true
      this.$store.dispatch('auth/login', {
        email: this.email,
        password: this.password
      }).then(result => {
        console.log('result', result)
        this.alert = {type: 'success', message: result.data.message}
        this.loading = false
        this.$router.push('/admin')
      }).catch(error => {
        this.loading = false
        if (error.response && error.response.data) {
          this.alert = {type: 'error', message: error.response.data.message || error.response.status}
        }
      })
    },
    google_submit () {
      if (!this.google_ready) return
      this.alert = null
      this.google_loading = true
      window.google_auth2.signIn()
        .then(() => this.$store.dispatch('auth/login_google', window.google_auth2.currentUser.get().Zi.access_token))
        .then(result => {
          this.alert = {type: 'success', message: result.data.message}
          this.google_loading = false
          this.$router.push('/admin')
        })
        .catch(error => {
          this.google_loading = false
          if (error.response && error.response.data) {
            this.alert = {type: 'error', message: error.response.data.message || error.response.status}
          }
        })
    }
  }
}
</script>
