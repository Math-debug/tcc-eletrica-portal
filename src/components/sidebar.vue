<template>
  <div>
    <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
    <v-navigation-drawer v-model="drawer" absolute bottom temporary>
      <v-list-item class="px-2">
        <v-list-item-avatar>
          <v-img
            src="https://iconarchive.com/download/i89179/icons8/ios7/Users-User-Male-4.ico"
          ></v-img>
        </v-list-item-avatar>

        <v-list-item-title>{{user != null ? user.userName : ""}}</v-list-item-title>
      </v-list-item>

      <v-divider></v-divider>

      <v-list dense>
        <v-list-item
          v-for="item in items"
          :key="item.title"
          @click="$emit('select', item.action)"
          link
        >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content class="p-2">
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script>
export default {
  name: "sidebar",
  props: {
    user: Object
  },
  data() {
    return {
      drawer: true,
      items: [
        {
          title: "Geral",
          icon: "mdi-home-city",
          action: null,
        },
        {
          title: "Usuários",
          icon: "mdi-account",
          action: "userDetail",
        },
        {
          title: "Grupo de usuários",
          icon: "mdi-account-group",
          action: "userGroupDetail",
        },
        {
          title: "Equipamentos",
          icon: "mdi-cellphone-link",
          action: "equipmentDetail",
        },
        {
          title: "Tipos de equipamentos",
          icon: "mdi-devices",
          action: "equipmentTypeDetail",
        },
        {
          title: "Relatórios de consumo",
          icon: "mdi-broadcast",
          action: "keepAliveDetail",
        },
      ],
      mini: false,
    };
  },
  methods: {},
};
</script>

<style scoped>
</style>
