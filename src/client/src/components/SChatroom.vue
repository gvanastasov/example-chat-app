<template>
  <div class="chatroom d-flex flex-column h-100">
    <div v-if="!chatId" class="d-flex justify-content-center align-items-center flex-grow-1">
      <p class="text-muted">You’re currently not in any chatroom.<br/> Select or create one to start chatting.</p>
    </div>
    <template v-else>
      <!-- Chat Messages -->
      <div class="messages flex-grow-1 overflow-auto p-3 bg-light border">
        <div
          v-for="(message, index) in chatMessages"
          :key="index"
          class="message mb-2"
          :class="{ 'text-end': message.user === username }"
        >
          <strong>{{ message.user }}</strong><span class="ml-2">{{ formatTimestamp(message.timestamp) }}</span>
          <br/>
          {{ message.text }}
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
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import { useUserStore } from '../stores/user';
import { useChatStore } from '../stores/chatStore';
import { formatDistanceToNow } from 'date-fns';

export default {
  setup() {
    const route = useRoute();
    const userStore = useUserStore();
    const chatStore = useChatStore();

    const username = computed(() => userStore.user.name);

    const newMessage = ref('');

    const chatId = computed(() => route.params.id);
    const chatMessages = computed(() => (chatStore.messages[chatId.value] || []).map(x => ({
      user: x.user,
      timestamp: x.timestamp,
      text: x.text,
    })));

    const sendMessage = () => {
      if (newMessage.value.trim()) {
        chatStore.sendMessage(chatId.value, newMessage.value);
        newMessage.value = '';
      }
    };

    const formatTimestamp = (timestamp) => {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    };

    let intervalId;
    onMounted(() => {
      intervalId = setInterval(() => {
        chatMessages.value = [...chatMessages.value];
      }, 60000);
    });

    onUnmounted(() => {
      clearInterval(intervalId);
    });

    return {
      username,
      chatId,
      chatMessages,
      newMessage,
      sendMessage,
      formatTimestamp,
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
