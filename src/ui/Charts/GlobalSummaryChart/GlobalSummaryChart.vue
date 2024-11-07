<template>
  <div class="flex flex-col gap-4">
    <div v-if="isDataReady" role="img" :aria-labelledby="`${uid}-description`" class="h-64">
      <Bar :id="uid" :options="chartOptions" :data="chartData" />
    </div>
    <div v-else class="h-64 flex items-center justify-center">
      <LoadingIndicator class="h-8 w-8" />
    </div>
    <GlobalSummaryChartTextualDescription 
      v-if="isDataReady"
      :data="chartData" 
      :id="`${uid}-description`" 
    />
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { storeToRefs } from "pinia";
import { Bar } from "vue-chartjs";
import { v4 as uuidv4 } from "uuid";
import { colorForIndex } from "../ColorPalettes";
import Localizer from "../../../Localizer";
import GlobalSummaryChartTextualDescription from "./GlobalSummaryChartTextualDescription.vue";
import LoadingIndicator from "../../LoadingIndicator.vue";
import { useStore } from "../../../stores/index";
import { useCapabilityStore } from "../../../stores/capabilityStore";
import { useImpactStore } from "../../../stores/impactStore";

// Store setup
const store = useStore();
const capabilityStore = useCapabilityStore();
const impactStore = useImpactStore();

// Get necessary store refs
const { language, strings } = storeToRefs(store);
const { capabilities } = storeToRefs(capabilityStore);
const { groupedCapabilities } = storeToRefs(capabilityStore);

// UID for aria description
const uid = ref(`globalsummarychart-${uuidv4()}`);

// Check if data is ready
const isDataReady = computed(() => {
  return capabilities.value && 
         groupedCapabilities.value && 
         Object.keys(groupedCapabilities.value).length > 0;
});

// Computed properties for data transformation
const groups = computed(() => {
  if (!isDataReady.value) return [];
  
  return Object.entries(groupedCapabilities.value)
    .filter(([_, gr]) => gr.length > 0) // Filter out empty groups
    .map(([_, gr]) => ({
      name: gr[0]?.environment[`display_name_${language.value}`],
      costs: impactStore.userTargets(gr).cost,
    }));
});

const generalOverhead = computed(() => {
  if (!capabilities.value) return 0;
  
  return capabilities.value.reduce((accumulator, capability) => {
    return accumulator + capability.userTargetImpact["cost"].inst_overhead;
  }, 0);
});

const labels = computed(() => {
  if (!strings.value || !groups.value) return [];
  
  return [
    ...groups.value.map((gr) => gr.name),
    strings.value.impact_facet_label_inst_overhead,
  ];
});

// Chart data computation
const chartData = computed(() => {
  if (!isDataReady.value) return { labels: [], datasets: [] };
  
  return {
    labels: labels.value,
    datasets: [
      {
        label: strings.value.impact_facet_label_direct,
        data: [...groups.value.map((gr) => gr.costs.direct), 0],
        backgroundColor: [colorForIndex(0)],
      },
      {
        label: strings.value.impact_facet_label_indirect,
        data: [...groups.value.map((gr) => gr.costs.indirect), 0],
        backgroundColor: [colorForIndex(1)],
      },
      {
        label: strings.value.generic_overhead,
        data: [
          ...groups.value.map((gr) => gr.costs.env_overhead),
          generalOverhead.value,
        ],
        backgroundColor: [colorForIndex(2)],
      },
    ],
  };
});

// Chart options with localization
const chartOptions = computed(() => ({
  maintainAspectRatio: false,
  indexAxis: "y",
  plugins: {
    legend: {
      position: "bottom",
    },
    tooltip: {
      callbacks: {
        label: (context) => {
          return new Intl.NumberFormat(`${language.value}-CA`, {
            style: "currency",
            currency: "CAD",
            maximumFractionDigits: 1,
            notation: "compact",
          }).format(Math.round(context.raw / 1000000) * 1000000);
        },
      },
    },
  },
  responsive: true,
  scales: {
    x: {
      stacked: true,
      ticks: {
        callback: (value) => {
          return Localizer.formatNumber(value, language.value, "currency");
        },
      },
      min: 0,
      max: 7000000000,
    },
    y: {
      stacked: true,
    },
  },
}));
</script>