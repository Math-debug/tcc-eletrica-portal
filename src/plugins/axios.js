import Vue from 'vue'
import axios from 'axios'

const API_URL = "http://" + window.location.hostname + ":9023";

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