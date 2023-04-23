import { server } from '../plugins/axios'

export default class equipmentService{
    getEquipments(){
        return server.get('/equipment')
    }
    createEquipments(data){
        return server.post('/equipment',data)
    }
}