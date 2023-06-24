import { server } from '../plugins/axios'

export default class equipmentService{
    getEquipments(){
        return server.get('/equipment')
    }
    getEquipment(id){
        return server.get('/equipment/'+id)
    }
    createEquipments(data){
        return server.post('/equipment',data)
    }
}