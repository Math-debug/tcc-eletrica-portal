<template>
    <div class="container">
        <div class="row">
            <div class="col-1">
                <sidebar @select="onOpenComponent" :user="user" />
            </div>
            <div class="col-12">
                <div class="mb-2">
                    <div v-if="tela == null">
                        <general/>
                    </div>
                    <div v-else-if="tela == 'userDetail'">
                        <userDetail />
                    </div>
                    <div v-else-if="tela == 'userGroupDetail'">
                        <userGroupDetail />
                    </div>
                    <div v-else-if="tela == 'equipmentDetail'">
                        <equipmentDetail />
                    </div>
                    <div v-else-if="tela == 'equipmentTypeDetail'">
                        <equipmentTypeDetail />
                    </div>
                    <div v-else-if="tela == 'anomalyDetail'">
                        <anomalyDetail />
                    </div>
                    <div v-else-if="tela == 'reportDetail'">
                        <reportDetail />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import sidebar from "../components/sidebar.vue";
import general from "../components/general.vue";
import userDetail from "../components/userDetail.vue";
import userGroupDetail from "../components/userGroupDetail.vue";
import equipmentDetail from "../components/equipmentDetail.vue";
import equipmentTypeDetail from "../components/equipmentTypeDetail.vue";
import anomalyDetail from "../components/anomalyDetail.vue"
import reportDetail from "../components/reportDetail.vue"


import userService from "../service/userService";

export default {
    name: "dashboard",
    components: {
        sidebar,
        general,
        userDetail,
        userGroupDetail,
        equipmentDetail,
        equipmentTypeDetail,
        anomalyDetail,
        reportDetail
    },
    data() {
        return {
            tela: null,
            user: null,
        };
    },
    created() {
      this.getUser();
    },
    methods: {
        getUser() {
            new userService()
                .getUsers()
                .catch(() => {
                    window.location.replace("/");
                })
                .then((data) => {
                    this.user = data.data;
                });
        },
        onOpenComponent: function(event) {
            this.tela = event;
        },
    }
};
</script>

<style scoped>

</style>
