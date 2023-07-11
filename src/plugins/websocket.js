import * as SockJS from 'sockjs-client';
import Stomp from 'stomp-websocket';
const SERVER = "http://" + window.location.hostname + ":9025"
export default function conectionWS() {
    var socket = new SockJS(SERVER+'/socket');
    var stompClient = Stomp.over(socket);
    return stompClient;
}