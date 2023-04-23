<template>
    <div data-app>
        <v-card>
            <v-card-title>
                <v-text-field class="col-10" v-model="search" label="Buscar" single-line hide-details></v-text-field>
            </v-card-title>
            <v-data-table :headers="headers" :items="equipmentList" :search="search"></v-data-table>
        </v-card>
    </div>
</template>

<script>

</script>

<style scoped>

</style>
