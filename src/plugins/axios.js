import Vue from 'vue'
import axios from 'axios'

const SERVER = "http://" + window.location.hostname + ":5555";

const server = axios.create({
  baseURL: SERVER,
  headers : headers()
})

function headers() {
  var headers = { 'Content-Type': 'application/json' }
  if ( localStorage.token && localStorage.token.length > 0 ) {
    headers['Authorization'] = 'Bearer ' + localStorage.token
  }
  return headers
}



export {
  server
}

Vue.prototype.$http = axios