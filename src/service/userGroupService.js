import axios from '../plugins/axios'

export default class UserGroupService{
    getGroups(){
        return axios.get('/usergroup')
    }
    createGroup(data){
        return axios.post('/usergroup',data)
    }
}