import axios from '../plugins/axios'

export default class equipmentService{
    getEquipments(){
        return axios.get('/equipment')
    }
    createEquipments(data){
        return axios.post('/equipment',data)
    }
}