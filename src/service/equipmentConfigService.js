import { server } from '../plugins/axios'

export default class equipmentConfigService{
    getConfigs(id){
        return server.get('/anomaly/config/equipment/' + id)
    }
    createEquipmentsConfig(data){
        return server.post('/anomaly/config',data)
    }
}