<template>
  <div class="app-container d-flex">
    <!-- Sidebar -->
    <aside class="sidebar bg-light border-end">
      <div class="logo p-3 text-center bg-danger text-white mb-3">
        <h3>ChatApp</h3>
      </div>
      <div class="chat-list px-3">
        <b-button variant="outline-danger" class="w-100 mb-2" @click="createChat">
            Create Chat
        </b-button>
        <b-list-group>
          <li
            v-for="chat in chats"
            :key="chat.id"
            class="list-group-item"
            @click="selectChat(chat.id)"
          >
            {{ chat.name }}
          </li>
        </b-list-group>
      </div>
    </aside>

    <!-- Main Content Area -->
    <c-page>
      <router-view />
    </c-page>
  </div>
</template>

<script>
import { onMounted, onUnmounted } from 'vue';

import { useChatStore } from '../../stores/chatStore';

import CPage from '../CPage.vue';

export default {
  components: { CPage },
  setup() {
    const chatStore = useChatStore();
    
    const createChat = () => {
      // todo: use popup from bootstrap-vue
      const name = prompt('Enter chat name:');
      if (name) {
        chatStore.createChat(name);
      }
    };

    const selectChat = (id) => {
      router.push(`/chat/${id}`);
      chatStore.joinChat(id);
    };

    onMounted(() => {
      chatStore.connectSocket();
    });

    onUnmounted(() => {
      chatStore.disconnectSocket();
    });

    return {
      chats: chatStore.chats,
      createChat,
      selectChat,
    };
  },
};
</script>

<style>
.app-container {
  height: 100vh;
}
.sidebar {
  width: 300px;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}
</style>