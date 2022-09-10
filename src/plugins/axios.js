import Vue from 'vue'
import axios from 'axios'

const API_URL = process.env.VUE_APP_API_URL

export default axios.create({
  baseURL: API_URL,
  headers : headers()
})

function headers() {
  var headers = { 'Content-Type': 'application/json' }
  if ( localStorage.token && localStorage.token.length > 0 ) {
    headers['Authorization'] = 'Bearer ' + localStorage.token
  }
  return headers
}

Vue.prototype.$http = axios