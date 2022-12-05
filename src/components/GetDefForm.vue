<template>
  <div class="container">
    <form @submit.prevent="submit">
      <input type="text" v-model="word"/>
      <button type="submit">Submit</button>
    </form>
  </div>
</template>

<script>
  import { ref } from 'vue';
  import { useStore} from 'vuex';
  import {computed} from 'vue';

  export default {
    name: "GetDefForm",
    setup(){
      const store = useStore();

      const word = ref('');

      const submit = () => {
        store.dispatch('getDef', word.value);
      }

      const user = computed(() => {
        return store.getters.user;
      });

      return { user, word, submit }
    }
  }
</script>