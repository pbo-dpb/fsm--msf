import { defineStore } from "pinia";
import { useCapabilityStore } from "./capabilityStore";

export const useImpactStore = defineStore("impact", {
  state: () => ({
    settings_perUnitDisplay: false,
    settings_selectedAspect: "cost",
  }),

  getters: {
    currentAspects() {
      return (group) => {
        const capabilityStore = useCapabilityStore();
        let capabilities = group ? group : capabilityStore.capabilities;

        return capabilities.reduce(
          (acc, capability) => {
            for (const [facet, impactForFacet] of Object.entries(
              capability.personnel
            )) {
              if (!acc.personnel[facet]) {
                acc.personnel[facet] = 0;
              }
              acc.personnel[facet] =
                acc.personnel[facet] + capability.personnel[facet];
            }

            for (const [facet, impactForFacet] of Object.entries(
              capability.cost
            )) {
              if (!acc.cost[facet]) {
                acc.cost[facet] = 0;
              }
              acc.cost[facet] = acc.cost[facet] + capability.cost[facet];
            }

            return acc;
          },
          {
            personnel: {},
            cost: {},
          }
        );
      };
    },

    userTargets() {
      return (group) => {
        const capabilityStore = useCapabilityStore();
        let capabilities = group ? group : capabilityStore.capabilities;

        return capabilities.reduce(
          (acc, capability) => {
            for (const [facet, impactForFacet] of Object.entries(
              capability.userTargetImpact.personnel
            )) {
              if (!acc.personnel[facet]) {
                acc.personnel[facet] = 0;
              }
              acc.personnel[facet] =
                acc.personnel[facet] +
                capability.userTargetImpact.personnel[facet];
            }

            for (const [facet, impactForFacet] of Object.entries(
              capability.userTargetImpact.cost
            )) {
              if (!acc.cost[facet]) {
                acc.cost[facet] = 0;
              }
              acc.cost[facet] =
                acc.cost[facet] + capability.userTargetImpact.cost[facet];
            }

            return acc;
          },
          {
            personnel: {},
            cost: {},
          }
        );
      };
    },
  },
});
