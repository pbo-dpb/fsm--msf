<template>
  <details
    class="print:hidden flex flex-col gap-2 border-l-2 border-blue-200 dark:border-blue-700 pl-2"
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
              <th scope="col">{{ strings?.capability_label }}</th>
              <th
                v-for="header in capabilitiesColumnHeaders"
                :key="header"
                scope="col"
              >
                {{ header }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(label, index) in environmentCapabilitiesChartData.labels"
              :key="label"
              class="even:bg-gray-50 dark:even:bg-gray-950"
            >
              <th scope="row">{{ label }}</th>
              <td
                v-for="dataset in environmentCapabilitiesChartData.datasets"
                :key="dataset.label"
                class="lining-nums tabular-nums"
              >
                {{ formatNumber(dataset.data[index]) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <dl class="mt-2 pt-2 border-t-2 border-gray-300 dark:border-gray-700">
        <div 
          v-for="(value, key) in overheadKvPairs" 
          :key="key"
          class="flex items-center gap-2"
        >
          <dt class="font-semibold">{{ key }}</dt>
          <dd class="inline-flex items-center gap-1">
            <ArrowRightIcon 
              aria-hidden="true" 
              class="h-4 w-4 text-gray-600 dark:text-gray-400"
            />
            {{ value }}
          </dd>
        </div>
      </dl>
    </div>
  </details>
</template>

<script setup>
import { computed,watch } from "vue";
import { storeToRefs } from "pinia";
import { ArrowRightIcon } from "@heroicons/vue/24/solid";
import { useStore } from "../../../stores/index";

// Props with validation
const props = defineProps({
  environmentCapabilitiesChartData: {
    type: Object,
    required: true,
    validator: (value) => {
      return value.datasets && 
             Array.isArray(value.datasets) && 
             value.labels && 
             Array.isArray(value.labels);
    }
  },
  environmentOverheadChartData: {
    type: Object,
    required: true,
    validator: (value) => {
      return value.datasets && 
             Array.isArray(value.datasets);
    }
  }
});

// Store setup
const store = useStore();
const { strings, language } = storeToRefs(store);

// Formatting function
const formatNumber = (value) => {
  if (!value && value !== 0) return '';
  
  try {
    return new Intl.NumberFormat(language.value, {
      maximumFractionDigits: 2
    }).format(value);
  } catch (error) {
    console.error('Error formatting number:', error);
    return value.toString();
  }
};

// Computed properties
const capabilitiesColumnHeaders = computed(() => {
  return props.environmentCapabilitiesChartData.datasets.map(
    dataset => dataset.label
  );
});

const overheadKvPairs = computed(() => {
  const pairs = {};
  props.environmentOverheadChartData.datasets.forEach(dataset => {
    pairs[dataset.label] = formatNumber(dataset.data[0]);
  });
  return pairs;
});

// Data validation
const isDataValid = computed(() => {
  return props.environmentCapabilitiesChartData.datasets.every(dataset => 
    dataset.data.length === props.environmentCapabilitiesChartData.labels.length
  );
});

// Watch for data inconsistencies
watch(isDataValid, (valid) => {
  if (!valid) {
    console.warn('Data length mismatch detected in chart data');
  }
});
</script>