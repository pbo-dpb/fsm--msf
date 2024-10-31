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
        // If no group is provided, use all capabilities (including Compliance)
        let capabilities = group ? group : capabilityStore.capabilities;

        return capabilities.reduce(
          (acc, capability) => {
            // Sum up personnel aspects
            for (const [facet, impactForFacet] of Object.entries(
              capability.personnel
            )) {
              if (!acc.personnel[facet]) {
                acc.personnel[facet] = 0;
              }
              acc.personnel[facet] =
                acc.personnel[facet] + capability.personnel[facet];
            }

            // Sum up cost aspects
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
            personnel: { total: 0 },
            cost: { total: 0 },
          }
        );
      };
    },

    userTargets() {
      return (group) => {
        const capabilityStore = useCapabilityStore();
        // If no group is provided, use all capabilities (including Compliance)
        let capabilities = group ? group : capabilityStore.capabilities;

        return capabilities.reduce(
          (acc, capability) => {
            // Sum up personnel target aspects
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

            // Sum up cost target aspects
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
            personnel: { total: 0 },
            cost: { total: 0 },
          }
        );
      };
    },
  },
});
