import { server } from '../plugins/axios'

export default class equipmentTypeService{
    getAll(){
        return server.get('/equipmenttype')
    }
    getById(id){
        return server.get('/equipmenttype/' + id)
    }
    create(data){
        return server.post('/equipmenttype',data)
    }
}