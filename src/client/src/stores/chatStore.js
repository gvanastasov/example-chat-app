import { defineStore } from 'pinia';
import { io } from 'socket.io-client';
import { ref, computed } from 'vue';
import { useUserStore } from './user';

const socketMessageTypes = {
  out: {
      CHAT_CREATE: 'chat:create',
      CHAT_JOIN: 'chat:join',
  },
  in: {
      CHAT_CREATE_ACK: 'chat:create:ack',
  }
};

export const useChatStore = defineStore('chatStore', () => {
  const userStore = useUserStore();
  
  const socket = ref(null);
  const currentChat = ref(null);
  const chats = ref([]);
  const messages = ref({});
  
  const user = computed(() => userStore.user);

  const handlers = {
    [socketMessageTypes.in.CHAT_CREATE_ACK]: (io, socket, data) => {
      console.log('Chat created:', data);
    },
  }

  const connectSocket = () => {
    if (!socket.value) {
      // todo: use env instead
      socket.value = io('http://localhost:5173', {
        path: '/ws',
      });

      socket.value.on('message', (msg) => {
        try {
          const { type, data } = JSON.parse(msg);
          const handler = handlers[type];
  
          if (!handler) {
            console.error(`Unknown message type: ${type}`);
            return;
          }
  
          handler(io, socket, data);
        } catch (err) {
          console.error('Failed to process message:', err);
        }
      });

      // socket.value.on('chat_message', (message) => {
      //   if (!messages.value[message.roomId]) {
      //     messages.value[message.roomId] = [];
      //   }
      //   messages.value[message.roomId].push(message);
      // });

      // socket.value.on('chat_history', (history) => {
      //   if (currentChat.value) {
      //     messages.value[currentChat.value] = history;
      //   }
      // });
    }
  };

  const disconnectSocket = () => {
    if (socket.value) {
      socket.value.disconnect();
      socket.value = null;
    }
  };

  const joinChat = (chatId) => {
    if (socket.value) {
      currentChat.value = chatId;
      socket.value.emit(messages.out.CHAT_JOIN, chatId);
    }
  };

  const sendMessage = (chatId, text) => {
    if (socket.value && user.value) {
      socket.value.emit('send_message', { roomId: chatId, user: user.value.name, text });
    }
  };

  const createChat = (name) => {
    if (socket.value && user.value) {
      socket.value.emit('message', { type: socketMessageTypes.out.CHAT_CREATE, data: { name, createdBy: user.value.name } });
    }
  };

  return {
    chats,
    messages,
    currentChat,
    user,
    connectSocket,
    disconnectSocket,
    joinChat,
    sendMessage,
    createChat,
  };
});