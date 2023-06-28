<template>
    <div class="container mt-2">
        <LineChartGenerator :chart-options="chartOptions" :chart-data="chartData" :chart-id="chartId" :dataset-id-key="datasetIdKey" :plugins="plugins" :css-classes="cssClasses" :styles="styles" :width="width" :height="height" />
        <div class="row mt-2">
            <v-card>
                <v-card-title>Status dos Equipamentos</v-card-title>
                <v-card-text v-for="item in offlineEquipments">
                    <v-icon style="color:green" v-if="!item.active" v-b-tooltip.hover title="Equipamento online">mdi-checkbox-marked-circle</v-icon>  
                    <v-icon v-if="item.active" style="color:red" v-b-tooltip.hover title="Equipamento offline">mdi-checkbox-blank-circle</v-icon>{{item.equipmentid + ' - ' + item.name}}</v-card-text>         
            </v-card>
        </div>
    </div>
</template>

<script>
import { Line as LineChartGenerator } from 'vue-chartjs/legacy'

import dashboardService from '../service/dashboardService'

import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    LineElement,
    LinearScale,
    CategoryScale,
    PointElement
} from 'chart.js'

ChartJS.register(
    Title,
    Tooltip,
    Legend,
    LineElement,
    LinearScale,
    CategoryScale,
    PointElement
)

export default {
    name: "general",
    components: {
        LineChartGenerator
    },
    props: {
        chartId: {
            type: String,
            default: 'line-chart'
        },
        datasetIdKey: {
            type: String,
            default: 'label'
        },
        width: {
            type: Number,
            default: 400
        },
        height: {
            type: Number,
            default: 300
        },
        cssClasses: {
            default: '',
            type: String
        },
        styles: {
            type: Object,
            default: () => {}
        },
        plugins: {
            type: Array,
            default: () => []
        }
    },

    mounted() {
        this.loadDashboards();
    },

    data() {
        return {
            chartData: {
                labels: [],
                datasets: [{
                    label: 'Potencia total medida (KVA/mês)',
                    backgroundColor: '#ff0000',
                    data: []
                }]
            },
            chartOptions: {
                responsive: true,
                maintainAspectRatio: false
            }, 
            offlineEquipments: {}
        }
    },

    methods: {
        loadDashboards(){
            new dashboardService().getConsumoMensal().then(data => {
                this.chartData.labels = data.data.map(x => {return x.mes})
                this.chartData.datasets[0].data = data.data.map(x => {return x.consumo})
            })
            new dashboardService().getOfflineEquipments().then(data=>{
                this.offlineEquipments = data.data
            })
            setTimeout(() => {
                    loadDashboards()
                }, 3000);
        }
    }
}
</script>

<style scoped>

</style>
