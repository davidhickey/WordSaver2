import { createStore } from 'vuex';
import { auth, db } from './firebaseConfig';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile
} from 'firebase/auth';
import { collection, addDoc, doc, setDoc, getDoc, getDocs, query, deleteDoc } from "firebase/firestore"; 
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
    },
    cards: []
  },
  getters: {
    user(state){
      return state.user;
    },
    wordData(state){
      return state.wordData;
    },
    cards(state){
      return state.cards;
    },
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
    },
    SET_CARDS(state, data) {
      state.cards = data;
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
      console.log('logIn');
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
      console.log('fetchUser');
      if (user) {
        const userData = await context.dispatch("getUserData", user.uid);
        context.commit("SET_USER", userData);
        context.commit("SET_LOGGED_IN", user !== null);
        console.log('user is logged in', user);
      } else {
        console.log('user not logged in');
        context.commit("SET_USER", null);
      }
    },

    async getUserData(context, uid){
      try {
        console.log('getUserData');
        const userRef = doc(db, "users", uid );
        const user = await getDoc(userRef);
        if(user.exists()) {
          console.log('User data is ', user.data());
          const userData = user.data();
          return userData;
        }
        else {
          throw new Error(`user with id of ${uid} doesn't exist`);
        }
      }
      catch(err){
        console.error(err);
      }
    },

    //Dictionary API GET
    async getDef(context, word) {
      try {
        console.log('getDef', word);
        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
        if(!response.ok){
          throw new Error('response.statusText');
        }
        const body = await response.json();
        const definitions = transformDefs(body);
        context.commit("SET_WORD_DATA", {word, data: definitions});
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

    async handleCardCreation(context, card) {
      //either creates cardList or gets cardList id
      //then creates a card
      try {
        console.log('handleCardCreation');
        const cardListId = context.state.user.data.cardListId || await context.dispatch("createCardList");
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
        await setDoc(cardsListRef, card, { merge: true });
        //trigger getCards to get most recent list
        context.dispatch('getCards');
      }
      catch(err){
        console.error(err);
      }
    },

    async getCards(context){
      try {
        console.log("getCards");
        const cardListId = context.state.user.data.cardListId;
        if(cardListId){
          const cardsArr = [];
          const cardsRef = query(collection(db, "cardLists", cardListId, "cards"));
          const querySnapshot = await getDocs(cardsRef);
          querySnapshot.forEach((doc) => {
            cardsArr.push(doc.data());
          });
          context.commit('SET_CARDS', cardsArr);
        }
      }
      catch(err){
        console.error(err);
      }
    },

    async removeCard(context, word){
      console.log("removeCard");
      const cardListId = context.state.user.data.cardListId;
      try {
        await deleteDoc(doc(db, "cardLists", cardListId, "cards", `${word}`));
        context.dispatch('getCards');
      }
      catch(err){
        console.err(err);
      }
    }
  }
})

// export the store
export default store