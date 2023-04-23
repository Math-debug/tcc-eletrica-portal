import { server } from '../plugins/axios'

export default class UserGroupService{
    getGroups(){
        return server.get('/usergroup')
    }
    createGroup(data){
        return server.post('/usergroup',data)
    }
}