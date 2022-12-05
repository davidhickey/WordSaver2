<template>
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-md-8">
        <div v-if="user.authChecked" class="card">
          <div v-if="user.loggedIn">
            <div class="card-body">
              <div class="alert alert-success" role="alert">
              You are logged in!
              <div class="my-4">
                    <button  @click.prevent="signOut" class="btn btn-primary">Log Out</button>
              </div>
              </div>
            </div>

            <div>
              <GetDefForm />
            </div>
            <div v-if="showWordData">
              <PostDef />
            </div>
          </div>
            <div v-else class="alert alert-danger" role="alert">
              Welcome :) Please log in or register.
            </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useStore } from 'vuex';
import { useRouter } from "vue-router";
import { computed } from 'vue';
import GetDefForm from '../components/GetDefForm.vue';
import PostDef from '../components/PostDef.vue'


export default {
  name: "HomePage",
  components: {
    GetDefForm,
    PostDef
  },
  setup() {
  const store = useStore();
  const router = useRouter();

  const user = computed(() => {
    console.log('get user');
    return store.getters.user;
  });

  const showWordData = computed(() => {
    return store.getters.wordData.data;
  })

  const signOut = async () => {
      await store.dispatch('logOut');
      router.push('/');
  }
    return {user, showWordData, signOut};
 }
  
  
};
</script>