<template>
  <div class="container">
    <div>
      <span>{{`Definition${definitions.length > 1 ? 's' : ''} for the word `}}</span><span><strong><i>{{word}}</i></strong></span>
    </div>
    <template v-for="def in definitions" :key="def.id">
    <div class="card">
      <strong>{{def.partOfSpeech}}</strong>
      <br>
      {{ def.definition }}
    </div>
  </template>
  </div>
</template>

<script>
  import { useStore } from 'vuex';
  import { computed } from 'vue';

  export default {
    name: "PostDef",
    setup(){
      const store = useStore();

      const word = computed(() => {
        return store.getters.wordData.word;
      });

      const definitions = computed(() => {
        return store.getters.wordData.data;
      });


      return { definitions, word }
    }
  }
</script>