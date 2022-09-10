import axios from '../plugins/axios'

export default class User{
    getUsers(){
        return axios.get('/user/get')
    }
    getAllUsers(){
        return axios.get('/user')
    }
    login(body){
        return axios.post('/user/login',body)
    }
    createUser(body){
        return axios.post('/user',body)
    }
}