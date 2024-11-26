<template>
  <div class="chatroom d-flex flex-column h-100">
    <div v-if="!currentChat" class="d-flex justify-content-center align-items-center flex-grow-1">
      <p class="text-muted">You’re currently not in any chatroom.<br/> Select or create one to start chatting.</p>
    </div>
    <template v-else>
      <!-- Chat Messages -->
      <div class="messages flex-grow-1 overflow-auto p-3 bg-light border">
        <div
          v-for="(message, index) in chatMessages"
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
    </template>
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useChatStore } from '../stores/chatStore';

export default {
  setup() {
    const route = useRoute();
    const chatStore = useChatStore();

    const newMessage = ref('');

    const chatId = computed(() => route.params.id);
    const chatMessages = computed(() => chatStore.messages[chatId] || []);

    watch(chatId, (id) => {
      if (id) {
        chatStore.joinChat(id);
      }
    });

    const sendMessage = () => {
      if (newMessage.value.trim()) {
        chatStore.sendMessage(chatId, newMessage.value);
        newMessage.value = '';
      }
    };

    return {
      currentChat: chatId.value,
      chatMessages,
      newMessage,
      sendMessage,
    };
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
