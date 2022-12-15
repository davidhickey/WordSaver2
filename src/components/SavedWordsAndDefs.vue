<template>
  <div class="container">
    Saved Words and Defs
    <ul v-for="card in cards" :key="card.word">
      <li>
        <strong>{{card.word}}</strong>
        <br>
        <i>{{card.partOfSpeech}}</i> - {{ card.definition }}
      </li>
    </ul>
  </div>
</template>

<script>
  import { useStore } from 'vuex';
  import { computed } from 'vue';

  export default {
    name: "SavedWordsAndDefs",
    setup(){
      const store = useStore();

      store.dispatch("getCards");

      const cards = computed(() => {
        return store.getters.cards;
      });

      // const definitions = computed(() => {
      //   return store.getters.wordData.data;
      // });

      // const submitCard = (word, def) => {
      //   const card = {
      //     word,
      //     definition: def.definition,
      //     partOfSpeech: def.partOfSpeech,
      //     example: def.example ?? "NA"
      //   };
      //   console.log('submit card ', card);

      //   store.dispatch('handleCardCreation', card);
      // }


      return { cards }
    }
  }
</script>