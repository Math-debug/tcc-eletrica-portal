<template>
    <div data-app>
        <v-card>
            <v-card-title>
                <v-text-field class="col-10" v-model="search" label="Buscar" single-line hide-details></v-text-field>
                <v-btn v-b-modal.modal-newUser class="col-2 btn btn-success" @click="defaultGroup">
                    Adicionar
                </v-btn>
            </v-card-title>
            <v-data-table :headers="headers" :items="grupoList" :search="search">
                <template v-slot:item="row">
                    <tr>
                        <td>{{row.item.groupName}}</td>
                        <td>
                            <v-btn class="mx-2" fab small v-b-tooltip.hover title="Editar registro" v-b-modal.modal-edit @click="loadUserGroup(row.item.id)">
                                <v-icon>mdi-pencil</v-icon>
                            </v-btn>
                        </td>
                    </tr>
                </template>
            </v-data-table>
        </v-card>
        <b-modal id="modal-newUser" title="Novo Grupo de usuário" @ok="createGroup" @cancel="defaultGroup">
            <v-text-field label="Grupo de usuario" v-model="groupName"></v-text-field>
        </b-modal>
        <b-modal id="modal-edit" title="Editar Grupo de usuário" @ok="updateUserGroup">
            <v-text-field label="Grupo de usuario" v-model="edit.groupName"></v-text-field>
        </b-modal>
    </div>
</template>

<script>
import userGroupService from "../service/userGroupService";

export default {
    components: {},
    name: "userGroupDetail",
    mounted() {
        this.load();
    },
    data() {
        return {
            show1: false,
            groupName: "",
            search: "",
            grupoList: [],
            headers: [
                { text: "Grupo", filterable: true, value: "grupo" },
            ],
            edit: {}
        };
    },
    methods: {
        load() {
            new userGroupService().getGroups().then((data) => {
                this.grupoList = [];
                this.groupList(data.data);
            });
        },
        groupList(list) {
            for (let item in list) {
                this.grupoList.push({
                    id:  list[item].id,
                    groupName: list[item].groupName,
                });
            }
        },
        defaultGroup() {
            this.groupName = "";
        },
        createGroup() {
            new userGroupService().createGroup({
                    groupName: this.groupName
                }).then(() => {
                    this.$swal("Sucesso", "Grupo inserido com sucesso!", "success");
                    this.load();
                })
                .catch((e) => {
                    this.$swal("Opss...", "Erro: " + e, "error");
                });
        },
        updateUserGroup(){
             new userGroupService().createGroup(this.edit).then(() => {
                    this.$swal("Sucesso", "Grupo atualizado com sucesso!", "success");
                    this.load();
                })
                .catch((e) => {
                    this.$swal("Opss...", "Erro: " + e, "error");
                });
        },
        loadUserGroup(id){
             new userGroupService().getById(id).then(data=>{
                this.edit = data.data
             })
        }
    },
};
</script>

<style scoped>

</style>
