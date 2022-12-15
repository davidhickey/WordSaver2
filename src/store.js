import { createStore } from 'vuex';
import { auth, db } from './firebaseConfig';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile
} from 'firebase/auth';
import { collection, addDoc, doc, setDoc, getDoc } from "firebase/firestore"; 
// import { doc, setDoc, getDoc } from "firebase/firestore"; 
import { transformDefs } from "./utils/helpers.js"



const store = createStore({
  state: {
    user: {
      loggedIn: false,
      data: null,
      authChecked: false,
    },
    wordData: {
      word: '',
      data: null,
    }
  },
  getters: {
    user(state){
      return state.user;
    },
    wordData(state){
      return state.wordData;
    }
  },
  mutations: {
    SET_LOGGED_IN(state, value) {
      state.user.loggedIn = value;
      state.user.authChecked = true;
    },
    SET_USER(state, data) {
      state.user.data = data;
    },
    SET_WORD_DATA(state, data) {
      state.wordData = data;
    }
  },
  actions: {
    //AUTH and USER CRUD
    async register(context, { email, password, name}){
      const response = await createUserWithEmailAndPassword(auth, email, password);
      if (response) {
        const { user } = response;
        console.log('create user response is ', user);
        await updateProfile(user, {displayName: name});
        const docRef = doc(db, "users", user.uid);
        const data = {
          email, 
          name, 
          uid: user.uid
        }
        await setDoc(docRef, data);
        context.commit('SET_USER', user);
      } else {
          throw new Error('Unable to register user');
      }
    },
    async logIn(context, { email, password }){
      const response = await signInWithEmailAndPassword(auth, email, password);
      if (response) {
          context.commit('SET_USER', response.user);
      } else {
          throw new Error('login failed');
      }
    },
    async logOut(context){
        await signOut(auth)
        context.commit('SET_USER', null);
    },
    async fetchUser(context, user) {
      context.commit("SET_LOGGED_IN", user !== null);
      if (user) {
        console.log('user is logged in', user);
        context.commit("SET_USER", {
          displayName: user.displayName,
          email: user.email,
          uid: user.uid,
        });
        console.log('context is ', context.state.user.data.uid);
      } else {
        console.log('user not logged in');
        context.commit("SET_USER", null);
      }
    },

    //Dictionary API GET
    async getDef(context, word) {
      try {
        console.log('getDef word is ', word);
        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
        if(!response.ok){
          throw new Error('response.statusText');
        }
        const body = await response.json();
        console.log('body ', body);

        const definitions = transformDefs(body);
        context.commit("SET_WORD_DATA", {word, data: definitions});
        console.log(`dictionary response for ${word} is `, transformDefs(body));
      }
      catch(e) {
        console.error(e);
      }
    },


    //Firestore CRUD for CardLists and Cards
    async createCardList(context) {
      try {
        console.log('createCardList');
        const uid = context.state.user.data.uid;
        const dbRef = collection(db, "cardLists");
        const data = uid;
        const cardListDoc = await addDoc(dbRef, { uid: data });
        console.log('cardList id is ', cardListDoc.id);

        if(cardListDoc.id){
          const userDbRef = doc(db, "users", uid);
          await setDoc(userDbRef, { cardListId: cardListDoc.id }, { merge: true });
          return cardListDoc.id;
        }
      }
      catch(err) {
        console.error(err);
      }
    },
    async getCardListId(context){
      try {
        console.log('getCardListId');
        const uid = context.state.user.data.uid;
        const userRef = doc(db, "users", uid );
        const user = await getDoc(userRef);
        if(user.exists()) {
          console.log('User data is ', user.data());
          const { cardListId } = user.data();
          console.log('getCardListId - card list id is ', cardListId);
          return cardListId;
        }
        else {
          console.error('user does not exist');
        }
      }
      catch(err){
        console.error(err);
      }
    },

    async handleCardCreation(context, card) {
      //either creates cardList or gets cardList id
      //then creates a card
      try {
      const cardListId = await context.dispatch("getCardListId") || await context.dispatch("createCardList");
      context.dispatch('postCard', {cardListId, card});
      }
      catch(err){
        console.error(err);
      }
    },

    async postCard(context, {cardListId, card}) {
      try {
      console.log('postCard', cardListId, card);
      const cardsListRef = doc(db, "cardLists", cardListId, "cards", `${card.word}`);
      await setDoc(cardsListRef, card,
        // { 
        //   word: "blue",
        //   definition: "blue test2 def",
        //   partOfSpeech: "blue pos",
        //   example: "blue example"  
        // }, 
        { merge: true });
      }
      catch(err){
        console.error(err);
      }
    },
  }
})

// export the store
export default store