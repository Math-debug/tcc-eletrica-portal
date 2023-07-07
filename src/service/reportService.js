import { server } from '../plugins/axios'

export default class reportService{
    getReports(){
        return server.get('/reports')
    }
    generateReport(id,param){
        return server.get('/reports/search/?reportid='+id+'&params='+param)
    }
}