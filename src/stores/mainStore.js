import { defineStore } from "pinia";
import { useCapabilityStore } from "./capabilityStore";
import { useVarsStore } from "./varsStore";

export const useMainStore = defineStore("main", {
  actions: {
    async instanciateStore(blob) {
      const capabilityStore = useCapabilityStore();
      const varsStore = useVarsStore();

      await Promise.all([
        capabilityStore.loadCapabilities(blob),
        varsStore.loadVars(blob),
      ]);

      if (capabilityStore.errors) {
        return capabilityStore.errors;
      }
    },
  },
});
