import { server } from '../plugins/axios'

export default class equipmentTypeService{
    getAll(){
        return server.get('/equipmenttype')
    }
    create(data){
        return server.post('/equipmenttype',data)
    }
}