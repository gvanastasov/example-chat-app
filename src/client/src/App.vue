<template>
  <div class="chat-container">
    <div v-for="(message, index) in messages" :key="index" class="message">
      <strong>{{ message.user }}:</strong> {{ message.text }}
    </div>
    <form @submit.prevent="sendMessage">
      <input v-model="newMessage" placeholder="Type a message..." />
      <button type="submit">Send</button>
    </form>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue';
import { io } from 'socket.io-client';

export default {
  setup() {
    const socket = ref(null); // Reference for the socket instance
    const messages = ref([]); // Reactive array to store messages
    const newMessage = ref(''); // Reactive variable for the input field

    // Function to send a new message
    const sendMessage = () => {
      if (newMessage.value.trim()) {
        const message = { user: 'User', text: newMessage.value };
        socket.value.emit('chat_message', message); // Emit the message to the server
        newMessage.value = ''; // Clear the input field
      }
    };

    // Lifecycle hook: Set up the WebSocket connection
    onMounted(() => {
      socket.value = io('http://localhost:5173', {
        path: '/ws',
      }); // Connect to the WebSocket server

      // Listen for incoming messages from the server
      socket.value.on('chat_message', (message) => {
        messages.value.push(message); // Add the message to the array
      });
    });

    // Lifecycle hook: Clean up the WebSocket connection on unmount
    onUnmounted(() => {
      if (socket.value) {
        socket.value.disconnect();
      }
    });

    return {
      messages, // Expose the messages array
      newMessage, // Expose the input field model
      sendMessage, // Expose the sendMessage function
    };
  },
};
</script>

<style>
.chat-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
}
.message {
  margin-bottom: 10px;
}
</style>