<template>
  <div class="nav-container">
    <div class="container left">

    </div>
    <div class="container center">
      <nav>
        <router-link to="/"> Home </router-link> |
        <router-link to="/register"> Register </router-link> |
        <router-link to="/sign-in"> Login </router-link>
      </nav>
    </div>
    <div class="container right">
      <div v-if="user.loggedIn">
        Hello {{ user.data.displayName }}
      </div>
    </div>
  </div>
</template>

<script>
  import { useStore} from 'vuex';
  import {computed} from 'vue';


  export default {
    name: "NavBar",
    setup(){
      const store = useStore();

      const user = computed(() => {
        return store.getters.user;
      });

      return { user }
    }
  }
</script>