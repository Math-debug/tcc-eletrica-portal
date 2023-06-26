import { server } from '../plugins/axios'

export default class UserGroupService{
    getGroups(){
        return server.get('/usergroup')
    }
    getById(id){
        return server.get('/usergroup/'+id)
    }
    createGroup(data){
        return server.post('/usergroup',data)
    }
}