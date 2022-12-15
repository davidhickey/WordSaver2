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
      <button @click="submitCard(word, def)">Save Word and Definition</button>
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

      const submitCard = (word, def) => {
        const card = {
          word,
          definition: def.definition,
          partOfSpeech: def.partOfSpeech,
          example: def.example ?? "NA"
        };
        console.log('submit card ', card);

        store.dispatch('handleCardCreation', card);
      }


      return { definitions, word, submitCard }
    }
  }
</script>