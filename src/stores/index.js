// store/index.js
import { defineStore } from "pinia";
import { useLanguageStore } from "./languageStore";
import { useEnvironmentStore } from "./environmentStore";
import { useCapabilityStore } from "./capabilityStore";
import { useImpactStore } from "./impactStore";
import { useVarsStore } from "./varsStore";
import { useMainStore } from "./mainStore";

export const useStore = defineStore("store", {
  state: () => ({
    initialized: false,
  }),

  getters: {
    // Combine all required store states into a single getter
    language: (state) => {
      const languageStore = useLanguageStore();
      return languageStore.language;
    },
    strings: (state) => {
      const languageStore = useLanguageStore();
      return languageStore.strings;
    },
    capabilities: (state) => {
      const capabilityStore = useCapabilityStore();
      return capabilityStore.capabilities;
    },
    environments: (state) => {
      const environmentStore = useEnvironmentStore();
      return environmentStore.environments;
    },
    vars: (state) => {
      const varsStore = useVarsStore();
      return varsStore.vars;
    },
  },

  actions: {
    async initialize() {
      if (this.initialized) return;

      const environmentStore = useEnvironmentStore();
      const impactStore = useImpactStore();

      // Initialize impact store with default settings
      impactStore.$patch({
        settings_perUnitDisplay: false,
        settings_selectedAspect: "cost",
      });

      this.initialized = true;
    },

    async instanciateStore(blob) {
      const mainStore = useMainStore();
      const errors = await mainStore.instanciateStore(blob);

      if (!errors) {
        await this.initialize();
      }

      return errors;
    },

    setLanguage(lang) {
      const languageStore = useLanguageStore();
      languageStore.$patch({ language: lang });
    },
  },
});

export default useStore;
