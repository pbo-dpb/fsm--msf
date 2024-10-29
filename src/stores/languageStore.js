import { defineStore } from "pinia";
import blStrings from "../assets/strings.json?json";

export const useLanguageStore = defineStore("language", {
  state: () => ({
    language: document.documentElement.lang,
  }),

  getters: {
    strings(state) {
      let loc = {};
      for (const [key, value] of Object.entries(blStrings)) {
        loc[key] = value[state.language];
      }
      return loc;
    },
  },
});
