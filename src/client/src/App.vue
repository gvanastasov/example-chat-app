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
          <router-link
            v-for="chat in chats"
            :key="chat.id"
            :to="{ name: 'Chatroom', params: { id: chat.id } }"
            class="list-group-item list-group-item-action"
          >
            {{ chat.name }}
          </router-link>
        </b-list-group>
      </div>
      <b-button class="mt-auto w-auto mb-2 mx-2" @click="createChat">
        Logout
      </b-button>
    </aside>

    <!-- Main Content Area -->
    <c-page>
      <router-view />
    </c-page>
  </div>
</template>

<script>
import { ref } from 'vue';
import CPage from './components/CPage.vue';

export default {
  components: { CPage },
  setup() {
    const chats = ref([
      { id: 1, name: 'General' },
      { id: 2, name: 'Tech' },
      { id: 3, name: 'Random' },
    ]);
    const selectedChatId = ref(null);

    const login = () => alert('Login functionality coming soon!');
    const logout = () => alert('Logout functionality coming soon!');
    const createChat = () => alert('Create Chat functionality coming soon!');
    const selectChat = (id) => {
      selectedChatId.value = id;
    };

    return {
      chats,
      selectedChatId,
      login,
      logout,
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
