<template>
  <tr :class="{ 'bg-purple-50 dark:bg-purple-950': highlight }">
    <!-- Template stays mostly the same -->
    <th
      scope="row"
      class="border border-gray-300 dark:border-gray-900 px-1 py-.5"
      :class="[
        shouldDisplayImpactDiff ? 'w-1/4' : 'w-1/3',
        { 'font-semibold': highlight },
      ]"
    >
      <slot></slot>
    </th>

    <td
      v-if="facetsOfInterest.length === 1"
      class="border border-gray-300 dark:border-gray-900 px-1 py-.5 tabular-nums text-center"
      :class="[shouldDisplayImpactDiff ? 'w-1/4' : 'w-1/3']"
    >
      <div class="inline-flex gap-1">
        <span
          :class="{
            'decoration-gray-500': hasDifference,
          }"
        >
          {{ currentValue }}
        </span>
      </div>
    </td>

    <template v-if="shouldDisplayImpactDiff">
      <td
        class="border border-gray-300 dark:border-gray-900 px-1 py-.5 tabular-nums text-center w-1/4"
        :class="[
          highlight
            ? 'bg-blue-100 dark:bg-blue-900'
            : 'bg-blue-50 dark:bg-blue-950',
        ]"
      >
        <span v-if="hasDifference">{{ formattedDifference }}</span>
      </td>

      <td
        class="border border-gray-300 dark:border-gray-900 px-1 py-.5 tabular-nums text-center w-1/4"
        :class="[
          highlight
            ? 'bg-blue-100 dark:bg-blue-900'
            : 'bg-blue-50 dark:bg-blue-950',
        ]"
      >
        {{ targetValue }}
      </td>
    </template>
  </tr>
</template>

<script setup>
import { computed } from "vue";
import { storeToRefs } from "pinia";
import { useStore } from "../../stores/index";
import { useImpactStore } from "../../stores/impactStore";
import Localizer from "../../Localizer";

const props = defineProps({
  aspect: {
    type: String,
    required: true,
    validator: (value) => ["personnel", "cost"].includes(value),
  },
  group: {
    type: Array,
    required: false,
    default: () => [],
  },
  facetsOfInterest: {
    type: Array,
    required: true,
    validator: (value) => Array.isArray(value) && value.length > 0,
  },
  highlight: {
    type: Boolean,
    default: false,
  },
  shouldDisplayImpactDiff: {
    type: Boolean,
    default: false,
  },
});

const store = useStore();
const impactStore = useImpactStore();
const { language } = storeToRefs(store);

// Modified to handle both group and total cases
const summaryCurrentAspects = computed(() => {
  return impactStore.currentAspects(props.highlight ? null : props.group);
});

const summaryUserTargets = computed(() => {
  return impactStore.userTargets(props.highlight ? null : props.group);
});

const formatValue = (value, digits = 2) => {
  if (!value && value !== 0) return "";

  try {
    if (props.aspect === "cost") {
      return new Intl.NumberFormat(`${language.value}-CA`, {
        style: "currency",
        currency: "CAD",
        minimumFractionDigits: digits,
        maximumFractionDigits: digits,
        notation: "compact",
      }).format(value);
    }
    return Localizer.formatNumber(value, language.value);
  } catch (error) {
    console.error("Error formatting value:", error);
    return value.toString();
  }
};

// Updated computeds to always use the first facet
const currentValue = computed(() => {
  const facet = props.facetsOfInterest[0];
  return formatValue(summaryCurrentAspects.value[props.aspect][facet]);
});

const targetValue = computed(() => {
  const facet = props.facetsOfInterest[0];
  return formatValue(summaryUserTargets.value[props.aspect][facet]);
});

const getDifference = computed(() => {
  const facet = props.facetsOfInterest[0];
  return (
    summaryUserTargets.value[props.aspect][facet] -
    summaryCurrentAspects.value[props.aspect][facet]
  );
});

const hasDifference = computed(() => {
  return getDifference.value !== 0;
});

const formattedDifference = computed(() => {
  const diff = getDifference.value;
  return `${diff > 0 ? "+" : ""}${formatValue(diff, 0)}`;
});
</script>
