<template>
  <b-container class="my-4">
    <b-card class="chat-container">
      <b-card-header class="bg-primary text-white">
        <h4 class="mb-0">Chat Room</h4>
      </b-card-header>
      <b-card-body>
        <div class="messages mb-3">
          <b-list-group>
            <b-list-group-item
              v-for="(message, index) in messages"
              :key="index"
              class="d-flex justify-content-between align-items-start"
            >
              <div>
                <strong>{{ message.user }}</strong>: {{ message.text }}
              </div>
            </b-list-group-item>
          </b-list-group>
        </div>
        <b-form @submit.prevent="sendMessage">
          <b-form-group>
            <b-input-group>
              <b-form-input
                v-model="newMessage"
                placeholder="Type your message..."
              />
              <b-button type="submit" variant="primary">Send</b-button>
            </b-input-group>
          </b-form-group>
        </b-form>
      </b-card-body>
    </b-card>
  </b-container>
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