import { defineStore } from "pinia";
import { Capability } from "../models/Capability";
import { useEnvironmentStore } from "./environmentStore";
import readXlsxFile from "read-excel-file";

export const useCapabilityStore = defineStore("capability", {
  state: () => ({
    capabilities: null,
    errors: null,
  }),

  actions: {
    async loadCapabilities(blob) {
      this.errors = null;
      let capabilities = await Capability.LoadFromXlsxBlob(blob);

      if ([capabilities].find((x) => x.errors.length > 0)) {
        this.errors = {
          CAPABILITIES: capabilities.errors,
        };
        return;
      }

      this.capabilities = capabilities.capabilities;
    },
  },

  getters: {
    groupedCapabilities(state) {
      if (!state.capabilities || state.capabilities.length === 0) return [];

      const environmentStore = useEnvironmentStore();
      let groups = Object.fromEntries(
        environmentStore.environments.map((i) => [i.id, []])
      );

      state.capabilities.forEach((capability) => {
        if (!capability.environment) return;
        const key = capability.environment?.id ?? null;
        if (!groups[key]) {
          groups[key] = [];
        }
        groups[key].push(capability);
      });

      return groups;
    },

    hasCustomUserTargets(state) {
      return (group) => {
        let capabilities = group ? group : state.capabilities;
        return capabilities.some((capability) => capability.hasUserTarget);
      };
    },
  },
});
