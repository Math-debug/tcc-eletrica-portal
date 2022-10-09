<template>
    <div class="container mt-2">
        <LineChartGenerator :chart-options="chartOptions" :chart-data="chartData" :chart-id="chartId" :dataset-id-key="datasetIdKey" :plugins="plugins" :css-classes="cssClasses" :styles="styles" :width="width" :height="height" />
        <div class="row mt-2">
            <v-card>
                <v-card-title>Status dos Equipamentos</v-card-title>
                <v-card-text>
                    <v-icon style="color:green">mdi-checkbox-marked-circle</v-icon>Motor elétrico - Setor B</v-card-text>
            <v-card-text>
                    <v-icon style="color:green">mdi-checkbox-marked-circle</v-icon>Motor elétrico - Setor C</v-card-text>
            <v-card-text>
                    <v-icon style="color:red">mdi-checkbox-blank-circle</v-icon>Motor elétrico - Setor D</v-card-text>
            </v-card>
        </div>
    </div>
</template>

<script>
import { Line as LineChartGenerator } from 'vue-chartjs/legacy'

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
    data() {
        return {
            chartData: {
                labels: [
                    'Janeiro',
                    'Fevereiro',
                    'Março',
                    'Abril',
                    'Maio',
                    'Junho',
                    'Julho'
                ],
                datasets: [{
                    label: 'Potencia total medida (KW/h)',
                    backgroundColor: '#ff0000',
                    data: [40, 39, 10, 40, 39, 80, 40]
                }]
            },
            chartOptions: {
                responsive: true,
                maintainAspectRatio: false
            }
        }
    }
}
</script>

<style scoped>

</style>
