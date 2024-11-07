<template>
  <tr :class="{ 'bg-purple-50 dark:bg-purple-950': highlight }">
    <!-- Title cell -->
    <th
      scope="row"
      class="font-normal border border-gray-300 dark:border-gray-900 px-1 py-.5"
      :class="[shouldDisplayImpactDiff ? 'w-1/4' : 'w-1/3']"
    >
      <slot></slot>
    </th>

    <!-- Single facet case -->
    <td
      v-if="facetsOfInterest.length === 1"
      class="border border-gray-300 dark:border-gray-900 px-1 py-.5 tabular-nums text-center"
      :class="[shouldDisplayImpactDiff ? 'w-1/4' : 'w-1/3']"
    >
      <div class="inline-flex gap-1">
        <span>{{ formattedCapabilityValue }}</span>
      </div>
    </td>

    <!-- Impact difference columns -->
    <template v-if="shouldDisplayImpactDiff">
      <td
        class="border border-gray-300 dark:border-gray-900 px-1 py-.5 tabular-nums text-center w-1/4"
        :class="[highlight ? 'bg-blue-100 dark:bg-blue-900' : 'bg-blue-50 dark:bg-blue-950']"
      >
        <span class="sr-only">{{ strings?.empty_cell }}</span>
      </td>

      <td
        class="border border-gray-300 dark:border-gray-900 px-1 py-.5 tabular-nums text-center w-1/4"
        :class="[highlight ? 'bg-blue-100 dark:bg-blue-900' : 'bg-blue-50 dark:bg-blue-950']"
      >
        {{ formattedImpactValue }}
      </td>
    </template>
  </tr>
</template>

<script setup>
import { computed,watch } from "vue";
import { storeToRefs } from "pinia";
import { useStore } from "../../stores/index";
import { useCapabilityStore } from "../../stores/capabilityStore";
import Localizer from "../../Localizer";

// Props with validation
const props = defineProps({
  aspect: {
    type: String,
    required: true,
    validator: (value) => ["personnel", "cost"].includes(value)
  },
  group: {
    type: Array,
    required: false,
    default: () => []
  },
  facetsOfInterest: {
    type: Array,
    required: true,
    validator: (value) => Array.isArray(value) && value.length > 0
  },
  highlight: {
    type: Boolean,
    default: false
  },
  shouldDisplayImpactDiff: {
    type: Boolean,
    default: false
  }
});

// Store setup
const store = useStore();
const capabilityStore = useCapabilityStore();
const { strings, language } = storeToRefs(store);
const { capabilities } = storeToRefs(capabilityStore);

// Computed values
const complianceCapability = computed(() => {
  return capabilities.value?.find(c => c.id === "Compliance");
});

const capabilityVal = computed(() => {
  return complianceCapability.value?.[props.aspect]?.inst_overhead ?? 0;
});

// Formatting functions
const formatValue = (value, isImpact = false) => {
  if (!value && value !== 0) return '';
  
  try {
    if (props.aspect === "cost") {
      return new Intl.NumberFormat(`${language.value}-CA`, {
        style: "currency",
        currency: "CAD",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
        notation: "compact"
      }).format(value);
    }
    return Localizer.formatNumber(value, language.value);
  } catch (error) {
    console.error('Error formatting value:', error);
    return value.toString();
  }
};

// Computed formatted values
const formattedCapabilityValue = computed(() => {
  return formatValue(capabilityVal.value, false);
});

const formattedImpactValue = computed(() => {
  return formatValue(capabilityVal.value, true);
});

// Error handling for missing capability
const hasValidCapability = computed(() => {
  return !!complianceCapability.value;
});

// Watch for errors (optional)
watch(hasValidCapability, (isValid) => {
  if (!isValid) {
    console.warn('Compliance capability not found in capabilities list');
  }
});
</script>

<style scoped>
/* Base styles for consistency */
.tabular-nums {
  font-variant-numeric: tabular-nums;
}

/* Transition for highlight effects */
tr {
  transition: background-color 150ms ease-in-out;
}

/* Print styles */
@media print {
  .border {
    @apply border-gray-400;
  }
  
  td, th {
    @apply p-1;
  }
}
</style>