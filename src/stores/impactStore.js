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

        const results = capabilities.reduce(
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

        // Add totals if not in a group
        if (!group) {
          results.personnel.total = Object.entries(results.personnel)
            .filter(([key]) => key !== "total")
            .reduce((sum, [_, value]) => sum + value, 0);

          results.cost.total = Object.entries(results.cost)
            .filter(([key]) => key !== "total")
            .reduce((sum, [_, value]) => sum + value, 0);
        }

        return results;
      };
    },

    userTargets() {
      return (group) => {
        const capabilityStore = useCapabilityStore();
        let capabilities = group ? group : capabilityStore.capabilities;

        const results = capabilities.reduce(
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

        // Add totals if not in a group
        if (!group) {
          results.personnel.total = Object.entries(results.personnel)
            .filter(([key]) => key !== "total")
            .reduce((sum, [_, value]) => sum + value, 0);

          results.cost.total = Object.entries(results.cost)
            .filter(([key]) => key !== "total")
            .reduce((sum, [_, value]) => sum + value, 0);
        }

        return results;
      };
    },
  },
});
