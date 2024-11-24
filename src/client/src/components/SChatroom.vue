<template>
  <div class="chatroom d-flex flex-column h-100">
    <!-- Chat Messages -->
    <div class="messages flex-grow-1 overflow-auto p-3 bg-light border">
      <div
        v-for="(message, index) in messages"
        :key="index"
        class="message mb-2"
      >
        <strong>{{ message.user }}:</strong> {{ message.text }}
      </div>
    </div>

    <!-- Message Input -->
    <form @submit.prevent="sendMessage" class="d-flex p-3 border-top">
      <b-form-input
        v-model="newMessage"
        placeholder="Type your message..."
        class="flex-grow-1 me-2"
      />
      <b-button type="submit" variant="primary">Send</b-button>
    </form>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import { io } from 'socket.io-client';
import { useUserStore } from '../stores/user'; // Import the user store

export default {
  setup() {
    // Access the current route and chat ID
    const route = useRoute();
    const chatId = route.params.id;

    // Access the user store
    const userStore = useUserStore();
    const user = userStore.user; // Get the current user from Pinia store

    const socket = ref(null);
    const messages = ref([]);
    const newMessage = ref('');

    // Send message function
    const sendMessage = () => {
      if (newMessage.value.trim()) {
        // Send the message with the current user's name
        const message = { user: user ? user.name : 'Anonymous', text: newMessage.value, chatId };
        socket.value.emit('chat_message', message);
        newMessage.value = '';
      }
    };

    // Set up socket connection when component is mounted
    onMounted(() => {
      socket.value = io('http://localhost:5173', {
        path: '/ws',
      });

      socket.value.on('chat_message', (message) => {
        if (message.chatId === chatId) {
          messages.value.push(message);
        }
      });
    });

    // Clean up the socket connection when the component is unmounted
    onUnmounted(() => {
      if (socket.value) socket.value.disconnect();
    });

    return { messages, newMessage, sendMessage };
  },
};
</script>

<style scoped>
.chatroom {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.messages {
  background-color: #f9f9f9;
}
</style>
