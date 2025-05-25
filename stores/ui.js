// stores/ui.js
import { defineStore } from "pinia";

export const useUiStore = defineStore("ui", {
  state: () => ({
    showSideBar: false,
  }),

  actions: {
    toggleSideBar() {
      this.showSideBar = !this.showSideBar;
    },
  },
});
