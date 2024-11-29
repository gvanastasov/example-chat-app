import { defineStore } from 'pinia';
import { io } from 'socket.io-client';
import { ref, computed } from 'vue';

import { useUserStore } from './user';
import { router } from '../router';

const socketMessageTypes = {
  out: {
    CHAT_CREATE: 'chat:create',
    CHAT_JOIN: 'chat:join',
    CHAT_MESSAGE_SEND: 'chat:message:send',
  },
  in: {
    CONNECT_SUCCESS: 'connect:success',
    CHAT_CREATED: 'chat:created',
    CHAT_MESSAGE_RECEIVED: 'chat:message:received',
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
    [socketMessageTypes.in.CONNECT_SUCCESS]: (_io, _socket, data) => {
      chats.value = data.chats;
    },
    [socketMessageTypes.in.CHAT_CREATED]: (_io, _socket, data) => {
      const existing = chats.value.find((chat) => chat.id === data.id);
      if (!existing) {
        chats.value.push({ id: data.id, name: data.name });
      }
    },
    [socketMessageTypes.in.CHAT_MESSAGE_RECEIVED]: (_io, _socket, data) => {
      if (!messages.value[data.chatId]) {
        messages.value[data.chatId] = [];
      }
      messages.value[data.chatId].push(data);
    },
  }

  const connectSocket = () => {
    if (!socket.value) {
      // todo: use env instead
      socket.value = io('http://localhost:5173', {
        path: '/ws',
      });

      socket.value.on('message', (msg) => {
        console.log('Received message', msg);
        try {
          const { type, data } = msg;
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
      socket.value.emit('message', { type: socketMessageTypes.out.CHAT_JOIN, data: { chatId } }, (ack) => {
        if (ack.success) {
          const id = ack.chat.id;
          const existing = chats.value.find((chat) => chat.id === id);
          if (!existing) {
            chats.value.push({ id, name: ack.chat.name });
          }
          messages.value[id] = ack.chat.history;
          currentChat.value = id;

          if (router.currentRoute.value.name !== 'Chatroom' || 
              router.currentRoute.value.params.id !== id) {
            router.push({ name: 'Chatroom', params: { id } });
          }
        }
      });
    }
  };

  const sendMessage = (chatId, text) => {
    if (socket.value && user.value) {
      socket.value.emit('message', { type: socketMessageTypes.out.CHAT_MESSAGE_SEND, data: { chatId, user: user.value.name, text } }, (ack) => {
        if (ack.success) {
          if (!messages.value[ack.message.chatId]) {
            messages.value[ack.message.chatId] = [];
          }
          messages.value[ack.message.chatId].push({ user: ack.message.user, text: ack.message.text });
        } else {
          // todo: handle error sending message
        }
      });
    }
  };

  const createChat = (name) => {
    if (socket.value && user.value) {
      socket.value.emit('message', { type: socketMessageTypes.out.CHAT_CREATE, data: { name, createdBy: user.value.name } }, (ack) => {
        if (ack.success) {
          joinChat(ack.id);
          console.log('Chat created:', ack.id);
        } else {
          // todo: handle error
          console.error('Failed to create chat:', ack.error);
        }
      });
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