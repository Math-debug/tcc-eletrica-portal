<template>
  <div data-app>
    <v-card>
      <v-card-title>
        <v-text-field
          class="col-10"
          v-model="search"
          label="Buscar"
          single-line
          hide-details
        ></v-text-field>
        <v-btn
          v-b-modal.modal-newUser
          class="col-2 btn btn-success"
          @click="defaultUser"
        >
          Adicionar
        </v-btn>
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="desserts"
        :search="search"
      ></v-data-table>
    </v-card>
    <b-modal
      id="modal-newUser"
      title="Novo usuario"
      @ok="createUser"
      @cancel="defaultUser"
    >
      <v-text-field label="Usuario" @input="setUserName"></v-text-field>
      <v-text-field
        label="Senha"
        v-model="password"
        :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
        @click:append="show1 = !show1"
        :type="show1 ? 'text' : 'password'"
        @input="setPassword"
      ></v-text-field>
      <v-select
        :items="grupoList"
        item-value="value"
        item-text="label"
        v-model="user.sysUserGroup"
        label="Grupo"
      ></v-select>
    </b-modal>
  </div>
</template>

<script>
import userGroupService from "../service/userGroupService";
import userService from "../service/userService";

export default {
  components: {},
  name: "userDetail",
  mounted() {
    this.load();
  },
  data() {
    return {
      show1: false,
      user: {},
      password: "",
      search: "",
      grupoList: [],
      headers: [
        {
          text: "Usuarios",
          value: "usuario",
        },
        { text: "Grupo", filterable: false, value: "grupo" },
      ],
      desserts: [],
    };
  },
  methods: {
    load() {
      new userGroupService().getGroups().then((data) => {
        this.grupoList = [];
        this.groupList(data.data);
      });
      new userService().getAllUsers().then((data) => {
        this.desserts = [];
        this.userList(data.data);
      });
      new userService().getUsers().catch(()=>{
      window.location.replace('/')
    })
    },
    groupList(list) {
      for (let item in list) {
        this.grupoList.push({
          value: list[item],
          label: list[item].groupName,
        });
      }
    },
    userList(list) {
      for (let item in list) {
        this.desserts.push({
          usuario: list[item].userName,
          grupo: list[item].sysUserGroup.groupName,
        });
      }
    },
    defaultUser() {
      this.user = {
        userName: null,
        password: null,
        userGroup: {
          idUserGroup: null,
        },
      };
    },
    setUserName(event) {
      this.user.userName = event;
    },
    setPassword(event) {
      this.user.password = event;
    },
    setGroup(event) {
      this.user.userGroup.idUserGroup = event;
    },
    createUser() {
      if (
        this.user.userName == null ||
        this.user.password == null ||
        this.user.userGroup == null
      ) {
        this.$swal(
          "Opss...",
          "Erro: Por gentileza preencha todos os campos",
          "error"
        );
      } else {
        new userService()
          .createUser(this.user)
          .then(() => {
            this.$swal("Sucesso", "Usuario inserido com sucesso!", "success");
            this.load();
          })
          .catch((e) => {
            this.$swal("Opss...", "Erro: " + e, "error");
          });
      }
    },
  },
};
</script>

<style scoped>
</style>
