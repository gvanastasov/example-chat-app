<template>
  <div class="app-container d-flex">
    <!-- Sidebar -->
    <aside class="sidebar bg-light border-end">
      <div class="logo p-3 text-center bg-danger text-white mb-3">
        <h3>ChatApp</h3>
      </div>
      <div class="chat-list px-3">
        <b-button variant="danger" class="w-100 mb-2" @click="createChat">
            Create Chat
        </b-button>
        <div v-if="chats && chats.length && currentChatId == null" class="my-3 text-muted small text-center">...or join one</div>
        <b-list-group>
          <b-list-group-item
            v-for="chat in chats"
            :key="chat.id"
            class="list-group-item-action"
            :class="{ 'active-chat': currentChatId && currentChatId === chat.id }"
            @click="selectChat(chat.id)"
          >
            {{ chat.name }}
          </b-list-group-item>
        </b-list-group>
      </div>
      <div class="p-3 mt-auto">
        <div class="my-3 text-muted small text-center">{{ username }}</div>
        <b-button variant="outline-danger" class="w-100" @click="logout">
          Logout
        </b-button>
      </div>
    </aside>

    <!-- Main Content Area -->
    <c-page>
      <router-view />
    </c-page>
  </div>
</template>

<script>
import { computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';

import { useUserStore } from '../../stores/user';
import { useChatStore } from '../../stores/chatStore';

import CPage from '../CPage.vue';

export default {
  components: { CPage },
  setup() {
    const router = useRouter();
    const userStore = useUserStore();
    const chatStore = useChatStore();

    const username = computed(() => userStore.user.name);
    const chats = computed(() => chatStore.chats);
    const currentChatId = computed(() => chatStore.currentChat);

    const createChat = () => {
      // todo: use popup from bootstrap-vue
      const name = prompt('Enter chat name:');
      if (name) {
        chatStore.createChat(name);
      }
    };

    const selectChat = (id) => {
      chatStore.joinChat(id);
    };

    const logout = () => {
      userStore.logout();
      router.push({ name: 'Login' });
    };

    onMounted(() => {
      chatStore.connectSocket();
    });

    onUnmounted(() => {
      chatStore.disconnectSocket();
    });

    return {
      username,
      currentChatId,
      logout,
      chats,
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
.active-chat {
  position: relative;
}
.active-chat::after {
  content: '';
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  width: 8px;
  height: 8px;
  background-color: #dc3545;
  border-radius: 50%;
}
</style>