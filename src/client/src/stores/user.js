import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
  }),
  actions: {
    login(username) {
      this.user = {
        id: 1,
        name: username,
      };
    },
    logout() {
      this.user = null;
    },
  },
});
