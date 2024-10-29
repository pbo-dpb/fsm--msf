<template>
  <table class="border border-gray-300 dark:border-gray-900 w-full">
    <!-- Header row -->
    <thead>
      <tr>
        <th role="cell" class="px-2 py-1 text-left"></th>
        <th scope="col" class="px-2 py-1 text-left">
          {{ strings?.[`impact_${aspect}_title`] }}
        </th>
        <template v-if="shouldDisplayImpactDiff">
          <th scope="col" class="px-2 py-1 text-left">
            {{ strings?.impact_user_diff_title }}
          </th>
          <th scope="col" class="px-2 py-1 text-left">
            {{ strings?.impact_user_total_title }}
          </th>
        </template>
      </tr>
    </thead>

    <!-- Table body -->
    <tbody>
      <!-- Group rows -->
      <TotalsTableRow
        v-for="group in groupedCapabilities"
        :key="getGroupKey(group)"
        :group="group"
        :aspect="aspect"
        :facets-of-interest="facetsOfInterest"
        :should-display-impact-diff="shouldDisplayImpactDiff"
      >
        {{ getGroupDisplayName(group) }}
      </TotalsTableRow>

      <!-- Others row -->
      <OthersTableRow
        :aspect="aspect"
        :facets-of-interest="facetsOfInterest"
        :should-display-impact-diff="shouldDisplayImpactDiff"
      >
        {{ strings?.impact_facet_label_other }}
      </OthersTableRow>

      <!-- Total row -->
      <TotalsTableRow
        :aspect="aspect"
        :facets-of-interest="facetsOfInterest"
        :highlight="true"
        :should-display-impact-diff="shouldDisplayImpactDiff"
      >
        {{ strings?.[`impact_facet_label_${facetsOfInterest[0]}`] }}
      </TotalsTableRow>
    </tbody>
  </table>
</template>

<script setup>
import { computed, watch } from "vue";
import { storeToRefs } from "pinia";
import { useStore } from "../../stores/index";
import { useCapabilityStore } from "../../stores/capabilityStore";
import TotalsTableRow from "./TotalsTableRow.vue";
import OthersTableRow from "./OthersTableRow.vue";

// Props with validation
const props = defineProps({
  facetsOfInterest: {
    type: Array,
    required: true,
    validator: (value) => Array.isArray(value) && value.length > 0,
  },
  aspect: {
    type: String,
    required: true,
    validator: (value) => ["personnel", "cost"].includes(value),
  },
});

// Store setup
const store = useStore();
const capabilityStore = useCapabilityStore();
const { strings, language } = storeToRefs(store);
const { groupedCapabilities } = storeToRefs(capabilityStore);

// Computed properties
const shouldDisplayImpactDiff = computed(() => {
  return Object.values(groupedCapabilities.value).some(
    (group) => group && capabilityStore.hasCustomUserTargets(group)
  );
});

// Helper functions
const getGroupKey = (group) => {
  return group[0]?.environment?.id || "unknown";
};

const getGroupDisplayName = (group) => {
  const environment = group[0]?.environment;
  return environment ? environment[`display_name_${language.value}`] : "";
};

const environmentForGroup = (group) => {
  return group[0]?.environment ?? null;
};

// Error handling
const validateGroup = (group) => {
  if (!Array.isArray(group) || group.length === 0) {
    console.warn("Invalid group structure detected");
    return false;
  }
  return true;
};

// Optional: Watch for data consistency
watch(
  () => groupedCapabilities.value,
  (newGroups) => {
    Object.values(newGroups).forEach((group) => {
      validateGroup(group);
    });
  },
  { deep: true }
);
</script>

<style scoped>
/* Base table styles */
table {
  border-collapse: collapse;
  width: 100%;
}

/* Header styles */
th {
  font-weight: 600;
  background-color: rgba(0, 0, 0, 0.02);
}

/* Dark mode adjustments */
:deep(.dark) th {
  background-color: rgba(255, 255, 255, 0.02);
}

/* Print styles */
@media print {
  table {
    page-break-inside: avoid;
  }

  th,
  td {
    border: 1px solid #9ca3af;
  }
}

/* Responsive adjustments */
@media (max-width: 640px) {
  table {
    font-size: 0.875rem;
  }
}
</style>
