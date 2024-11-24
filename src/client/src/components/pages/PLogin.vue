<template>
    <div class="landing-page d-flex justify-content-center align-items-center vh-100">
      <div class="card p-4 w-50">
        <h3 class="text-center mb-4">Welcome to ChatApp</h3>
        <form @submit.prevent="handleLogin">
          <div class="mb-3">
            <label for="username" class="form-label">Username</label>
            <b-form-input
              id="username"
              v-model="username"
              placeholder="Enter your username"
            />
          </div>
          <b-button type="submit" variant="primary" class="w-100">
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
          userStore.login(username.value); // Call the fake login
          router.push('/chat/1'); // Redirect to the first chat room
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
  