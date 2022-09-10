<template>
    <div data-app>
        <v-card>
            <v-card-title>
                <v-text-field class="col-10" v-model="search" label="Buscar" single-line hide-details></v-text-field>
                <v-btn v-b-modal.modal-newUser class="col-2 btn btn-success" @click="defaultEquipment">
                    Adicionar
                </v-btn>
            </v-card-title>
            <v-data-table :headers="headers" :items="equipmentList" :search="search"></v-data-table>
        </v-card>
        <b-modal id="modal-newUser" title="Novo equipamento" @ok="createEquipments" @cancel="defaultEquipment">
            <v-text-field label="Nome do equipamento" v-model="equipmentName"></v-text-field>
            <v-select :items="typeList" item-value="id" item-text="name" v-model="type" label="Tipo"></v-select>
            <v-text-field label="Tensäo Nominal" v-model="voltage" type="number"></v-text-field>
            <v-text-field label="Corrente Nominal" v-model="nominalCurrent" type="number"></v-text-field>
            <v-text-field label="Descriçäo" v-model="description"></v-text-field>
        </b-modal>
    </div>
</template>

<script>
import equipmentService from "../service/equipmentService";
import equipmentTypeService from "../service/equipmentTypeService";

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
            ],
            equipmentName: "",
            type: null,
            typeList: [],
            voltage: null,
            nominalCurrent: null,
            description: null,
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
                });
            }
        },
        equipmentTypeList(list) {
            for (let item in list) {
                this.typeList.push({
                    id: list[item],
                    name: list[item].name,
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
                }).then(() => {
                    this.$swal("Sucesso", "Grupo inserido com sucesso!", "success");
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
