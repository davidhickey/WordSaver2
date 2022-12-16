<template>
  <div class="container">
    Saved Words and Defs
    <ul v-for="card in cards" :key="card.word">
      <li>
        <strong>{{card.word}}</strong>
        <br>
        <i>{{card.partOfSpeech}}</i> - {{ card.definition }}

        <button @click="removeWord(card.word)">Delete</button>
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

      console.log("render SavedWordsAndDef component");
      store.dispatch("getCards");

      const cards = computed(() => {
        return store.getters.cards;
      });

      const removeWord = (word) => {
        store.dispatch("removeCard", word);
      }

      return { cards, removeWord }
    }
  }
</script>