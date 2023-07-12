<template>
    <div data-app>
        <v-card>
            <v-card-title>
                <v-text-field class="col-10" v-model="search" label="Buscar" single-line hide-details></v-text-field>
                <v-select v-model="selecionado" class="col-3" label="Status" :items="status" item-value="value" item-text="label">
                </v-select>
            </v-card-title>
            <v-data-table :headers="headers" :items="anomalyList.filter(list => {
                        if(this.selecionado == null){
                            return list.statusid != 'CLOSED'
                        }
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
                                    <v-btn class="mx-2" fab small  v-b-tooltip.hover title="Adicionar ação" v-b-modal.modal-action @click="selectAnomaly(row.item)">
                                        <v-icon style="color:black">mdi-plus</v-icon>
                                    </v-btn>
                                </td>
                                <td>
                                    <v-btn class="mx-2" fab small  v-b-tooltip.hover title="listar ações" v-b-modal.modal-action-list @click="selectAnomalyList(row.item.anomalyid)">
                                        <v-icon style="color:black">mdi-list-box-outline</v-icon>
                                    </v-btn>
                                </td>
                            </tr>
</template>
            </v-data-table>    
        </v-card>
        <b-modal id="modal-action" title="Adicionar Ação" @ok="sendAnomalyAction">
            <v-text-field label="Descrição da ação" v-model="anomalyAction.observation"></v-text-field>
        </b-modal>
        <b-modal id="modal-action-list" title="Lista de ações">
            <v-data-table
            :headers="headerActions"
            :items="anomalyActionList"
            ></v-data-table>
        </b-modal>
    </div>
</template>

<script>
import anomalyService from '../service/anomalyService'
import userService from "../service/userService";
import anomalyActionService from "../service/anomalyActionService";
import socketF from "../plugins/websocket";


export default {

    mounted() {
        this.load();
    },

    data() {
        return {
            search: "",
            anomalyList: [],
            headers: [
                { text: "Id do Equipamento", filterable: true, value: "keepAlive.equipment.id" },
                { text: "Status", filterable: true, value: "statusid" },
                { text: "Tipo de anomalia", filterable: true, value: "anomalytype.description" },
                { text: "Descrição", filterable: true, value: "description" },
                { text: "Dt. Anomalia", filterable: true, value: "createdat" },
                { text: "Dt. Normalização", filterable: true, value: "normalizedat" },
                { text: "Dt. Fechamento", filterable: true, value: "closedat" },
            ],
            status: [
                { value: null, label: "TODOS EM ABERTO" },
                { value: "OPEN", label: "ABERTO" },
                { value: "TRATED", label: "TRATADO" },
                { value: "NORMALIZED", label: "NORMALIZADO" },
                { value: "CLOSED", label: "FECHADO" },
            ],
            selecionado: null,
            anomalyAction: {},
            anomaly: {},
            headerActions: [
                { text: "Id da ação", value: "actionid" },
                { text: "Ação", value: "observation" },
                { text: "Usuário", value: "user.userName" }
            ],
            anomalyActionList: []
        }
    },
    methods: {
        load() {
            new anomalyService().getAnomalys().then(data => {
                this.anomalyList = data.data

                var socket = socketF();
                socket.connect({},
                    (frame) => {
                        console.log("Websocket iniciado");

                        socket.subscribe("/topic/new", (message) => {
                            let anomaly = JSON.parse(message.body);
                            this.anomalyList.push(anomaly)
                        });
                        socket.subscribe("/topic/update", (message) => {
                            let anomaly = JSON.parse(message.body);
                            this.anomalyList = this.anomalyList.map(item => {
                                if(item.anomalyid == anomaly.anomalyid){
                                    return anomaly
                                }else {
                                    return item
                                }
                            })
                        });
                    },
                    (error) => {
                        console.log(error);
                    }
                );
            })
        },

        fortmateDate(date) {
            if (date == null) {
                return null
            }
            const data = new Date(date);

            const dia = this.adicionarZero(data.getDate());
            const mes = this.adicionarZero(data.getMonth() + 1);
            const ano = data.getFullYear();
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
        loadUrgence(urgence) {
            if (urgence == 'HIGH') {
                return 'background:#ff6961'
            } else if (urgence == 'MEDIUM') {
                return 'background:#add8e6'
            } else {
                return 'background:#90ee90'
            }
        },
        sendAnomalyAction(action) {
            action.anomaly = this.anomaly
            new userService()
                .getUsers().then(data => {
                    action.user = data.data
                    this.anomalyAction = { ...this.anomalyAction, anomaly: action.anomaly, user: action.user }
                    new anomalyActionService().createAnomalyAction(this.anomalyAction).then(() => {
                        this.anomalyAction.observation = null
                        this.$swal("Sucesso", "Ação inserida com sucesso!", "success");
                    }).catch((e) => {
                        this.anomalyAction.observation = null
                        this.$swal("Opss...", "Erro: " + e, "error");
                    })
                })
        },
        selectAnomaly(item) {
            this.anomaly = item
        },
        selectAnomalyList(id) {
            new anomalyActionService().getAnomalyActionList(id).then(data => {
                this.anomalyActionList = data.data
            })
        }
    }
}
</script>

<style scoped>

</style>
