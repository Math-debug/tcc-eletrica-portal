import { server } from '../plugins/axios'

export default class dashboardService{
    getOfflineEquipments(){
        return server.get('/reports/dashboard/offlineequipment')
    }
    getConsumoMensal(){
        return server.get('/reports/dashboard/consumomensal')
    }
}