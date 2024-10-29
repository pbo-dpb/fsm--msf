<template>
  <div class="flex flex-col gap-4">
    <div class="h-32">
      <Bar :id="uid" :options="chartOptions" :data="chartData" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { storeToRefs } from "pinia";
import { Bar } from "vue-chartjs";
import { v4 as uuidv4 } from "uuid";
import { colorForIndex } from "../ColorPalettes";
import { useLanguageStore } from "../../stores/languageStore";
import { useCapabilityStore } from "../../stores/capabilityStore";
import { useImpactStore } from "../../stores/impactStore";

// Store setup
const languageStore = useLanguageStore();
const capabilityStore = useCapabilityStore();
const impactStore = useImpactStore();

const { strings, language } = storeToRefs(languageStore);
const { capabilities, groupedCapabilities } = storeToRefs(capabilityStore);
const { settings_selectedAspect } = storeToRefs(impactStore);

// UID
const uid = ref(`overheadchart-${uuidv4()}`);

// Computed Properties
const generalOverhead = computed(() => {
  if (!capabilities.value) return 0;
  return capabilities.value.reduce((accumulator, capability) => {
    return (
      accumulator +
      capability.userTargetImpact[settings_selectedAspect.value].inst_overhead
    );
  }, 0);
});

const environmentOverheads = computed(() => {
  let envKv = {};

  Object.entries(groupedCapabilities.value || {}).forEach(([envId, gr]) => {
    if (!gr.length || ["Joint"].includes(envId)) return;
    const environment = gr[0]?.environment;
    if (!environment) return;

    let label = strings.value.per_environment_env_overhead_label.replace(
      ":environment",
      environment[`display_name_${language.value}`]
    );

    envKv[label] = gr.reduce((accumulator, capability) => {
      return (
        accumulator +
        capability.userTargetImpact[settings_selectedAspect.value].env_overhead
      );
    }, 0);
  });

  return envKv;
});

const labels = computed(() => [
  strings.value.general_overhead_label,
  ...Object.keys(environmentOverheads.value),
]);

const data = computed(() => [
  generalOverhead.value,
  ...Object.values(environmentOverheads.value),
]);

const chartData = computed(() => ({
  labels: labels.value,
  datasets: [
    {
      data: data.value,
      backgroundColor: [
        colorForIndex(2),
        ...Object.keys(environmentOverheads.value).map(() => colorForIndex(3)),
      ],
    },
  ],
}));

const chartOptions = computed(() => ({
  maintainAspectRatio: false,
  indexAxis: "y",
  plugins: {
    legend: {
      display: false,
    },
  },
  responsive: true,
  scales: {
    x: {
      ticks: {
        callback(value) {
          const formatter = new Intl.NumberFormat(language.value, {
            notation: "compact",
          });
          return formatter.format(value);
        },
      },
    },
  },
}));
</script>