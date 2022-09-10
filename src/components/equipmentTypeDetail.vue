<template>
    <div data-app>
        <v-card>
            <v-card-title>
                <v-text-field class="col-10" v-model="search" label="Buscar" single-line hide-details></v-text-field>
                <v-btn v-b-modal.modal-newUser class="col-2 btn btn-success" @click="defaultGroup">
                    Adicionar
                </v-btn>
            </v-card-title>
            <v-data-table :headers="headers" :items="grupoList" :search="search"></v-data-table>
        </v-card>
        <b-modal id="modal-newUser" title="Novo Tipo de Equipamento" @ok="createGroup" @cancel="defaultGroup">
            <v-text-field label="Tipo do Equipamento" v-model="equipmentName"></v-text-field>
        </b-modal>
    </div>
</template>

<script>
import equipmentTypeService from "../service/equipmentTypeService";

export default {
    components: {},
    name: "equipmentTypeDetail",
    mounted() {
        this.load();
    },
    data() {
        return {
            show1: false,
            equipmentName: "",
            search: "",
            grupoList: [],
            headers: [
                { text: "Tipo de equipamento", filterable: true, value: "name" },
            ],
        };
    },
    methods: {
        load() {
            new equipmentTypeService().getAll().then((data) => {
                this.grupoList = [];
                this.groupList(data.data);
            });
        },
        groupList(list) {
            for (let item in list) {
                this.grupoList.push({
                    name: list[item].name,
                });
            }
        },
      defaultGroup(){
        this.equipmentName = "";
      },
      createGroup(){
        new equipmentTypeService().create({
          name: this.equipmentName
        }).then(()=>{ this.$swal("Sucesso", "Equipamento inserido com sucesso!", "success");
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
