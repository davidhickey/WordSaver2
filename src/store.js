import { createStore } from 'vuex';
import { auth, db } from './firebaseConfig';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile
} from 'firebase/auth';
import { collection, addDoc } from "firebase/firestore"; 
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
    async register(context, { email, password, name}){
      const response = await createUserWithEmailAndPassword(auth, email, password);
      if (response) {
        const { user } = response;
        await updateProfile(user, {displayName: name});
        const docRef = await addDoc(collection(db, "users"), { email, name});
        console.log("Document written with ID: ", docRef.id);
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
        console.log('user is logged in');
        context.commit("SET_USER", {
          displayName: user.displayName,
          email: user.email
        });
      } else {
        console.log('user not logged in');
        context.commit("SET_USER", null);
      }
    },
    async getDef(context, word) {
      console.log('getDef word is ', word);
      try {
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
    }
  }
})

// export the store
export default store