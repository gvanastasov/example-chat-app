<template>
    <div class="landing-page d-flex justify-content-center align-items-center vh-100">
      <div class="card p-4 w-50">
        <h3 class="text-center mb-4">Welcome to ChatApp</h3>
        <form @submit.prevent="handleLogin">

          <b-input-group prepend="Username" class="mb-3">
            <b-form-input v-model="username" id="username"></b-form-input>
          </b-input-group>
          <b-button type="submit" variant="danger" class="w-100">
            Login
          </b-button>
        </form>
      </div>
    </div>
  </template>
  
  <script>
  import { ref } from 'vue';
  import { useUserStore } from '../../stores/user';
  import { useRouter } from 'vue-router';
  
  export default {
    setup() {
      const username = ref('');
      const userStore = useUserStore();
      const router = useRouter();
  
      const handleLogin = () => {
        if (username.value.trim()) {
          userStore.login(username.value);
          router.push('/chat');
        } else {
          alert('Please enter a username!');
        }
      };
  
      return {
        username,
        handleLogin,
      };
    },
  };
  </script>
  
  <style scoped>
  .landing-page {
    background-color: #f8f9fa;
  }
  .card {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  </style>
  