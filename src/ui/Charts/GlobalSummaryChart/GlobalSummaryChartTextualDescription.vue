<template>
  <details
    class="print:hidden flex flex-col gap-2 border-l-2 border-blue-200 dark:border-blue-700 pl-2"
    :id="id"
  >
    <summary
      class="cursor-pointer text-blue-900 hover:text-blue-800 dark:text-blue-100 dark:hover:text-blue-200 text-sm font-semibold select-none"
    >
      {{ strings?.chart_alt_text_label }}
    </summary>
    <div>
      <div class="overflow-x-auto prose dark:prose-invert max-w-none">
        <table class="table">
          <thead>
            <tr>
              <th role="cell" class="w-1/4" scope="col"></th>
              <th
                v-for="dataset in data.datasets"
                :key="dataset.label"
                class="w-1/4"
                scope="col"
              >
                {{ dataset.label }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(label, index) in data.labels"
              :key="label"
              class="even:bg-gray-50 dark:even:bg-gray-950"
            >
              <th scope="row">{{ label }}</th>
              <td
                v-for="(dataset, idx) in data.datasets"
                :key="idx"
                class="lining-nums tabular-nums"
              >
                <span v-if="formatValue(dataset.data[index])">
                  {{ formatValue(dataset.data[index]) }}
                </span>
                <span v-else class="sr-only">{{ strings?.empty_cell }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </details>
</template>

<script setup>
import { computed } from "vue";
import { storeToRefs } from "pinia";
import Localizer from "../../../Localizer";
import { useStore } from "../../../stores/index";

// Store setup
const store = useStore();
const { strings, language } = storeToRefs(store);

// Props with validation
const props = defineProps({
  data: {
    type: Object,
    required: true,
    validator: (value) => {
      return (
        value.datasets &&
        Array.isArray(value.datasets) &&
        value.labels &&
        Array.isArray(value.labels)
      );
    },
  },
  id: {
    type: String,
    required: true,
  },
});

// Methods
const formatValue = (value) => {
  if (!value || isNaN(value)) return null;

  try {
    return Localizer.formatNumber(value, language.value, "currency");
  } catch (error) {
    console.error("Error formatting value:", error);
    return value.toString();
  }
};

// Computed properties
const columnHeaders = computed(() =>
  props.data.datasets.map((dataset) => dataset.label)
);

// Optional: Add error boundary
const hasValidData = computed(() => {
  return props.data?.datasets?.length > 0 && props.data?.labels?.length > 0;
});
</script>

<style scoped>
/* Ensure table headers are properly aligned */
.table th[scope="col"] {
  @apply text-left px-4 py-2;
}

.table th[scope="row"] {
  @apply text-left px-4 py-2;
}

/* Ensure numerical data is right-aligned */
.table td {
  @apply text-right px-4 py-2;
}

/* Ensure proper dark mode contrast */
.dark .table th,
.dark .table td {
  @apply text-gray-100;
}

/* Print styles */
@media print {
  .table {
    @apply break-inside-avoid;
  }
}
</style>
