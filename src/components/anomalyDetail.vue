<template>
    <div data-app>
        <v-card>
            <v-card-title>
                <v-text-field class="col-10" v-model="search" label="Buscar" single-line hide-details></v-text-field>
                <v-select 
                    v-model="selecionado"
                    class="col-3" 
                    label="Status"
                    :items="status" 
                    item-value="value"
                    item-text="label">
                </v-select>
            </v-card-title>
            <v-data-table :headers="headers" :items="anomalyList.filter(list => {
                return list.statusid == this.selecionado
            }).map(x => x)" :search="search">
             <template v-slot:item="row">
                    <tr :style="loadUrgence(row.item.urgeceid)">
                        <td>{{row.item.keepAlive.equipment.id}}</td>
                        <td v-if="row.item.statusid == 'CLOSED'">
                            <v-icon style="color:green" v-b-tooltip.hover title="Fechado">mdi-check-all</v-icon>
                        </td>
                        <td v-else-if="row.item.statusid == 'NORMALIZED'">
                            <v-icon style="color:blue" v-b-tooltip.hover title="Normalizado">mdi-check</v-icon>
                        </td>
                        <td v-else-if="row.item.statusid == 'TRATED'">
                            <v-icon style="color:orange" v-b-tooltip.hover title="Tratado">mdi-alert-circle-check-outline</v-icon>
                        </td>
                        <td v-else-if="row.item.statusid == 'OPEN'">
                            <v-icon style="color:red" v-b-tooltip.hover title="Aberto">mdi-alert-circle-outline</v-icon>
                        </td>
                        <td><strong>{{row.item.anomalytype.description}}</strong></td>
                        <td>
                            <ul v-for="item in row.item.description.split('\n')">
                                <li v-if="item.length > 0">
                                    <div>{{item}}</div>
                                </li>
                            </ul>
                        </td>
                        <td>{{fortmateDate(row.item.createdat)}}</td>
                        <td>{{fortmateDate(row.item.normalizedat)}}</td>
                        <td>{{fortmateDate(row.item.closedat)}}</td>
                        <td>
                            <v-btn class="mx-2" fab small  v-b-tooltip.hover title="Adicionar ação">
                                <v-icon style="color:black">mdi-plus</v-icon>
                            </v-btn>
                        </td>
                    </tr>
              </template>
            </v-data-table>    
        </v-card>
    </div>
</template>

<script>

import anomalyService from '../service/anomalyService'

export default{

    mounted() {
        this.load();
    },

    data(){
        return{
            search: "",
            anomalyList: [],
            headers: [
                { text: "Id do Equipamento", filterable: true, value:"keepAlive.equipment.id" },
                { text: "Status", filterable: true, value:"statusid" },
                { text: "Tipo de anomalia", filterable: true, value:"anomalytype.description" },
                { text: "Descrição", filterable: true,value:"description" },
                { text: "Dt. Anomalia", filterable: true, value:"createdat" },
                { text: "Dt. Normalização", filterable: true, value:"normalizedat" },
                { text: "Dt. Fechamento", filterable: true, value:"closedat" },
            ],
            status:[
                {value:"OPEN",label:"ABERTO"},
                {value:"TRATED",label:"TRATADO"},
                {value:"NORMALIZED",label:"NORMALIZADO"},
                {value:"CLOSED",label:"FECHADO"},
            ],
            selecionado: 'OPEN'
        }
    },
    methods: {
        load(){
            new anomalyService().getAnomalys().then(data => {
                this.anomalyList = data.data
            })
            setTimeout(() => {
                this.load()
            }, 3000);
        },

        fortmateDate(date){
            if(date == null){
                return null
            }
            const data = new Date(date);

            const dia = this.adicionarZero(data.getUTCDate());
            const mes = this.adicionarZero(data.getUTCMonth() + 1);
            const ano = data.getUTCFullYear();
            const horas = this.adicionarZero(data.getHours());
            const minutos = this.adicionarZero(data.getMinutes());
            const segundos = this.adicionarZero(data.getSeconds());

            // Criando a string formatada
            return dia + "/" + mes + "/" + ano + " " + horas + ":" + minutos + ":" + segundos;
        },
        adicionarZero(numero) {
            if (numero < 10) {
                return "0" + numero;
            }
            return numero;
        },
        loadUrgence(urgence){
            console.log(urgence)
            if(urgence == 'HIGH'){
                return 'background:#ff6961'
            }else if(urgence == 'MEDIUM'){
                return 'background:#add8e6'
            }else {
                return 'background:#90ee90'
            }
        }
    }
}

</script>

<style scoped>

</style>
