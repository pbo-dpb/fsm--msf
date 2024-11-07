<template>
  <div role="img" class="w-full h-16 -mt-8">
    <Bar
      v-if="chartData"
      :options="chartOptions"
      :data="chartData"
      :aria-label="strings?.chart_aria_label"
    />
    <div
      v-else
      class="w-full h-full flex items-center justify-center text-gray-500"
    >
      {{ strings?.no_data_message }}
    </div>
  </div>
</template>

<script setup>
import { computed, watch } from "vue";
import { storeToRefs } from "pinia";
import { Bar } from "vue-chartjs";
import {
  Chart as ChartJS,
  Tooltip,
  Legend,
  BarElement,
  LinearScale,
  CategoryScale,
} from "chart.js";
import { useStore } from "../../../stores/index";
import { useImpactStore } from "../../../stores/impactStore";
import Localizer from "../../../Localizer";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Legend, Tooltip);

// Props with validation
const props = defineProps({
  chartData: {
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
  xMax: {
    type: Number,
    required: true,
    validator: (value) => value > 0,
  },
});

// Store setup
const store = useStore();
const impactStore = useImpactStore();

// Store refs
const { strings, language } = storeToRefs(store);
const { settings_selectedAspect } = storeToRefs(impactStore);

// Formatting functions
const formatCurrency = (value, isCompact = true) => {
  return new Intl.NumberFormat(`${language.value}-CA`, {
    style: "currency",
    currency: "CAD",
    minimumFractionDigits: value >= 1000000000 ? 1 : 0,
    maximumFractionDigits: value >= 1000000000 ? 2 : 0,
    notation: isCompact ? "compact" : "standard",
  }).format(value);
};

const formatNumber = (value, isCompact = true) => {
  return new Intl.NumberFormat(`${language.value}-CA`, {
    notation: isCompact ? "compact" : "standard",
  }).format(value);
};

// Chart options
const chartOptions = computed(() => ({
  maintainAspectRatio: false,
  indexAxis: "y",
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      callbacks: {
        label: (context) => {
          return settings_selectedAspect.value === "cost"
            ? formatCurrency(context.raw)
            : formatNumber(context.parsed.x);
        },
      },
    },
  },
  scales: {
    x: {
      stacked: true,
      ticks: {
        callback: (value) => {
          return settings_selectedAspect.value === "cost"
            ? formatCurrency(value, true)
            : formatNumber(value, true);
        },
      },
      min: 0,
      max: props.xMax,
    },
    y: {
      stacked: true,
      ticks: {
        font: {
          weight: "bold",
        },
      },
      afterFit(scaleInstance) {
        const vw = Math.max(
          document.documentElement.clientWidth || 0,
          window.innerWidth || 0
        );
        scaleInstance.width = vw < 768 ? 150 : 250;
      },
    },
  },
  responsive: true,
}));

// Optional: Validate chart data
const isDataValid = computed(() => {
  if (!props.chartData?.datasets) return false;

  const dataLengths = props.chartData.datasets.map((ds) => ds.data.length);
  return dataLengths.every((len) => len === props.chartData.labels.length);
});

// Watch for data issues
watch(isDataValid, (valid) => {
  if (!valid) {
    console.warn("Chart data length mismatch detected");
  }
});
</script>
