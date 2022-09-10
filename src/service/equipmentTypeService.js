import axios from '../plugins/axios'

export default class equipmentTypeService{
    getAll(){
        return axios.get('/equipmenttype')
    }
    create(data){
        return axios.post('/equipmenttype',data)
    }
}