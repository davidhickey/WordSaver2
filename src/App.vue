<template>
 <div>
  <NavBar />
  <router-view />
  </div>
</template>

<script>
import NavBar from "./components/NavBar.vue";
import { useStore } from 'vuex';
import { auth } from './firebaseConfig';

export default {
  name: 'App',
  components: {
    NavBar
  },
  setup(){
    console.log('App component');

    const store = useStore();

    auth.onAuthStateChanged(user => {
      console.log('onAuthStateChange');
      store.dispatch("fetchUser", user);
    });
  }

}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
