<template>
    <div data-app>
        <v-card>
            <v-card-title>
                <v-text-field class="col-10" v-model="search" label="Buscar" single-line hide-details></v-text-field>
                <v-btn v-b-modal.modal-newUser class="col-2 btn btn-success" @click="defaultEquipment">
                    Adicionar
                </v-btn>
            </v-card-title>
            <v-data-table :headers="headers" :items="equipmentList" :search="search">
                <template v-slot:item="row">
              <tr>
                <td>{{row.item.id}}</td>
                <td>{{row.item.name}}</td>
                <td>{{row.item.equipmentTypeName}}</td>
                <td>{{row.item.voltage}}</td>
                <td>{{row.item.nominalCurrent}}</td>
                <td>{{row.item.description}}</td>
                <td v-if="row.item.active">
                    <v-btn class="mx-2" fab green small style="color: #1f512e;">
                        <v-icon>mdi-lan</v-icon>
                    </v-btn>
                </td>
                <td v-else>
                    <v-btn class="mx-2" fab small style="color: #ff0000;">
                        <v-icon>mdi-lan-disconnect</v-icon>
                    </v-btn>
                </td>
                <td v-if="row.item.syncronized">
                    <v-btn class="mx-2" fab green small style="color: #1f512e;" @click="syncronize(row.item)">
                        <v-icon>mdi-sync</v-icon>
                    </v-btn>
                </td>
                <td v-else>
                    <v-btn class="mx-2" fab small style="color: #ff0000;" @click="syncronize(row.item)">
                        <v-icon>mdi-sync-alert</v-icon>
                    </v-btn>
                </td>
                <td>
                    <v-btn class="mx-2" fab small v-b-modal.modal-equipConfig @click="loadConfigs(row.item.id)">
                        <v-icon>mdi-cog</v-icon>
                    </v-btn>
                </td>
                <td>
                    <v-btn class="mx-2" fab small v-b-modal.modal-editUser @click="loadEquipment(row.item.id)">
                        <v-icon>mdi-pencil</v-icon>
                    </v-btn>
                </td>
              </tr>
</template>
            </v-data-table>
        </v-card>
        <b-modal id="modal-newUser" title="Novo equipamento" @ok="createEquipments" @cancel="defaultEquipment">
            <v-text-field label="Nome do equipamento" v-model="equipmentName"></v-text-field>
            <v-select
              :items="typeList"
              item-value="value"
              item-text="label"
              v-model="type"
              label="Tipo"
            ></v-select>
            <v-text-field label="Tensäo Nominal" v-model="voltage" type="number"></v-text-field>
            <v-text-field label="Corrente Nominal" v-model="nominalCurrent" type="number"></v-text-field>
            <v-text-field label="Descriçäo" v-model="description"></v-text-field>
            <v-text-field label="Ip" v-model="ip"></v-text-field>
        </b-modal>
        <b-modal id="modal-equipConfig" title="Configurações" @ok="updateAnomalyConfig">
            <v-checkbox class="mb-4"
                v-model="configs.equipment.verify"
                label="Verificar anomalias"
                hide-details
            ></v-checkbox>
            <v-text-field label="Tensäo Máxima" v-model="configs.vmax" type="number"></v-text-field>
            <v-text-field label="Tensäo Mínima" v-model="configs.vmin" type="number"></v-text-field>
            <v-text-field label="Corrente Máxima" v-model="configs.imin" type="number"></v-text-field>
            <v-text-field label="Corrente Mínima" v-model="configs.imax" type="number"></v-text-field>
            <v-select 
            :items="typeNetwork"
            item-value="value"
            item-text="label"
            label="Tipo de Rede"
            v-model="configs.type">
            </v-select>
        </b-modal>
        <b-modal id="modal-editUser" title="Editar equipamento" @ok="updatequipment">
            <v-text-field label="Nome do equipamento" v-model="edit.name"></v-text-field>
            <v-select
              :items="typeList"
              item-value="value"
              item-text="label"
              v-model="edit.equipmentType"
              label="Tipo"
            ></v-select>
            <v-text-field label="Tensäo Nominal" v-model="edit.voltage" type="number"></v-text-field>
            <v-text-field label="Corrente Nominal" v-model="edit.nominalCurrent" type="number"></v-text-field>
            <v-text-field label="Descriçäo" v-model="edit.description"></v-text-field>
            <v-text-field label="Ip" v-model="edit.ip"></v-text-field>
        </b-modal>
    </div>
</template>

<script>
import equipmentService from "../service/equipmentService";
import equipmentTypeService from "../service/equipmentTypeService";
import equipmentConfigService from "../service/equipmentConfigService"

export default {
    components: {},
    name: "equipmentDetail",
    mounted() {
        this.load();
    },
    data() {
        return {
            show1: false,
            search: "",
            equipmentList: [],
            headers: [
                { text: "Id", filterable: true, value: "id" },
                { text: "Equipamento", filterable: true, value: "name" },
                { text: "Tipo", filterable: true, value: "equipmentTypeName" },
                { text: "Tensäo", filterable: false, value: "voltage" },
                { text: "Corrente", filterable: false, value: "nominalCurrent" },
                { text: "Descriçäo", filterable: false, value: "description" },
                { text: "Operação", filterable: true, value: "active" },
                { text: "Sincronizando", filterable: true, value: "syncronized" },
            ],
            equipmentName: "",
            type: {},
            typeList: [],
            voltage: null,
            nominalCurrent: null,
            description: null,
            ip: null,
            configs: {equipment:{}},
            edit:{},
            typeNetwork: [
                {label:'Monofásico', value:'MONOPHASIC'},
                {label:'Bifásico', value:'BIPHASIC'},
                {label:'Trifásico', value:'TRIPHASIC'}
            ]
        };
    },
    methods: {
        load() {
            new equipmentService().getEquipments().then((data) => {
                this.equipmentList = [];
                this.equipmentListConverter(data.data);
            });
            new equipmentTypeService().getAll().then((data) => {
                this.typeList = [];
                this.equipmentTypeList(data.data);
            })
        },
        equipmentListConverter(list) {
            for (let item in list) {
                this.equipmentList.push({
                    id: list[item].id,
                    name: list[item].name,
                    equipmentTypeName: list[item].equipmentType.name,
                    voltage: list[item].voltage,
                    nominalCurrent: list[item].nominalCurrent,
                    description: list[item].description,
                    active: list[item].active,
                    syncronized: list[item].syncronized,
                    ip: list[item].ip,
                    equipmentType: list[item].equipmentType
                });
            }
        },
        equipmentTypeList(list) {
            for (let item in list) {
                this.typeList.push({
                    value: list[item],
                    label: list[item].name,
                });
            }
        },
        defaultEquipment() {
            this.groupName = "";
        },
        createEquipments() {
            new equipmentService().createEquipments({
                    name: this.equipmentName,
                    equipmentType: this.type,
                    voltage: this.voltage,
                    nominalCurrent: this.nominalCurrent,
                    description: this.description,
                    ip: this.ip
                }).then(() => {
                    this.$swal("Sucesso", "Equipamento inserido com sucesso!", "success");
                    this.load();
                })
                .catch((e) => {
                    this.$swal("Opss...", "Erro: " + e, "error");
                });
        },

        syncronize(item){
            item.syncronized = !item.syncronized
            new equipmentService().createEquipments(item)
            .then(() => {
                    this.$swal("Sucesso", "Equipamento atualizado!", "success");
                    this.load();
                })
                .catch((e) => {
                    this.$swal("Opss...", "Erro: " + e, "error");
                });
        },

        loadConfigs(id){
            new equipmentConfigService().getConfigs(id).then(data => {
                this.configs = data.data
                console.log(this.configs)
            }).catch(()=>{
                this.configs = {equipment:{id:id}}
            })
        },
        updateAnomalyConfig(){
            if((this.configs.vmax != undefined || this.configs.vmax != null) && (this.configs.imax != undefined || this.configs.imax != null)){
            new equipmentConfigService().createEquipmentsConfig(this.configs).then(() => {
                this.$swal("Sucesso", "Equipamento atualizado!", "success");
            })
            }else {
                this.$swal("Erro", "É obrigatório o preenchimento dos campos te tensão e corrente máximos", "error");
            }
        },
        loadEquipment(id){
            new equipmentService().getEquipment(id).then(data => {
                this.edit = data.data
            })
        },
        updatequipment() {
            new equipmentService().createEquipments(this.edit).then(() => {
                    this.$swal("Sucesso", "Equipamento atualizado com sucesso!", "success");
                    this.load();
                })
                .catch((e) => {
                    this.$swal("Opss...", "Erro: " + e, "error");
                });
        },
    },
};
</script>

<style scoped>

</style>
