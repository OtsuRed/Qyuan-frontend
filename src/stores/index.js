import {createPinia, defineStore} from 'pinia';

const pinia = createPinia();

export default pinia;

export const useUserStore = defineStore('user', {
  state: () => ({ username: '小川', userid: 123 }),
  getters: {

  },
  actions: {
    setUserName(username) {
      this.username = username;
    },
  },
});