<template>
<router-view></router-view>
</template>

<script>
import VueTheMask from 'vue-the-mask';
import Vue from 'vue'

Vue.use(VueTheMask)

export default {
  name: 'App',

  components: {
  },

  data: () => ({
    //
  }),
};
</script>
