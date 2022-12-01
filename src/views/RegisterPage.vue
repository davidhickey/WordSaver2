<!-- <template>
  <div>RegisterPage.vue</div>
</template> -->



<template>
  <div>
      <form @submit.prevent="register">
          <h2>Register</h2>
          <input
              type="email"
              placeholder="Email address..."
              v-model="email"
          />
          <input
              type="password"
              placeholder="password..."
              v-model="password"
          />
          <button type="submit">Register</button>
      </form>
  </div>
</template>
<script>
// import firebase from 'firebase';
import { auth } from './../firebaseConfig.js';
import { createUserWithEmailAndPassword } from 'firebase/auth';
export default {
  name: 'RegisterPage',
  data() {
    return {
        email: '',
        password: '',
    };
  },
  methods: {
    register() {
      createUserWithEmailAndPassword(auth, this.email, this.password)
        .then(() => {
            alert('Successfully registered! Please login.');
            this.$router.push('/');
        })
        .catch(error => {
            alert(error.message);
        });
    },
  },
};
</script>