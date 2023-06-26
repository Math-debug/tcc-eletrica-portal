import { server } from '../plugins/axios'

export default class anomalyService{
    getAnomalys(){
        return server.get('/anomaly')
    }
}