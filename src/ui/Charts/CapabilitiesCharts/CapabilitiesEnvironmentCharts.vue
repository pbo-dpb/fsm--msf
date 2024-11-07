<template>
  <div class="w-full flex flex-col gap-2">
    <h3 class="text-xl font-thin flex flex-col gap-1">
      {{ environment[`display_name_${language}`] }}
    </h3>

    <div
      role="img"
      :aria-describedby="`${uid}-description`"
      class="w-full flex flex-col gap-2"
    >
      <EnvironmentCapabilitiesAspectChart
        :x-max="xMax"
        :chart-data="environmentCapabilitiesChartData"
      />

      <EnvironmentOverheadChart
        :x-max="xMax"
        :chart-data="environmentOverheadChartData"
      />
    </div>

    <CapabilitiesChartTextualDescription
      :id="`${uid}-description`"
      :environment-overhead-chart-data="environmentOverheadChartData"
      :environment-capabilities-chart-data="environmentCapabilitiesChartData"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, onUnmounted } from "vue";
import { storeToRefs } from "pinia";
import { v4 as uuidv4 } from "uuid";
import { useStore } from "../../../stores/index";
import { useCapabilityStore } from "../../../stores/capabilityStore";
import { useImpactStore } from "../../../stores/impactStore";
import { colorForIndex } from "../ColorPalettes";
import { Environment } from "../../../models/Environment";

import EnvironmentCapabilitiesAspectChart from "./EnvironmentCapabilitiesAspectChart.vue";
import EnvironmentOverheadChart from "./EnvironmentOverheadChart.vue";
import CapabilitiesChartTextualDescription from "./CapabilitiesChartTextualDescription.vue";

// Props with validation
const props = defineProps({
  environment: {
    type: Environment,
    required: true,
    validator: (value) => value instanceof Environment,
  },
});

// Store setup
const store = useStore();
const capabilityStore = useCapabilityStore();
const impactStore = useImpactStore();

// Store refs
const { strings, language } = storeToRefs(store);
const { groupedCapabilities } = storeToRefs(capabilityStore);
const { settings_selectedAspect: selectedAspect } = storeToRefs(impactStore);

// Component state
const barThickness = ref(16);
const uid = ref(`capenvcharts-${uuidv4()}`);

// Computed properties
const sortedCapabilities = computed(() => {
  return Object.values(groupedCapabilities.value)
    .map((caps) => {
      return caps.sort((a, b) =>
        a[`display_name_${language.value}`].localeCompare(
          b[`display_name_${language.value}`]
        )
      );
    })
    .flat()
    .filter((c) => {
      return c.environment?.id === props.environment?.id;
    });
});

const xMax = computed(() => {
  return selectedAspect.value === "cost" ? 2500000000 : 25000;
});

const environmentOverheadChartData = computed(() => {
  return {
    labels: [strings.value?.generic_overhead],
    datasets: [
      {
        label: strings.value?.generic_overhead,
        backgroundColor: colorForIndex(2),
        data: [
          sortedCapabilities.value.reduce((acc, capability) => {
            return (
              acc +
              capability.userTargetImpact[selectedAspect.value].env_overhead
            );
          }, 0),
        ],
        barThickness: barThickness.value,
      },
    ],
  };
});

const environmentCapabilitiesChartData = computed(() => {
  const datasets = {};
  let colorIndex = 0;

  sortedCapabilities.value.forEach((capability) => {
    Object.entries(capability.userTargetImpact[selectedAspect.value]).forEach(
      ([facet, impactValue]) => {
        // Skip special facets
        if (["total", "env_overhead", "inst_overhead"].includes(facet)) return;

        // Initialize dataset if needed
        if (!datasets[facet]) {
          datasets[facet] = {
            label: strings.value?.[`impact_facet_label_${facet}`],
            backgroundColor: colorForIndex(colorIndex++),
            data: [],
            barThickness: barThickness.value,
          };
        }

        datasets[facet].data.push(impactValue);
      }
    );
  });

  return {
    labels: sortedCapabilities.value.map((capability) => {
      const vw = Math.max(
        document.documentElement.clientWidth || 0,
        window.innerWidth || 0
      );
      return capability[`display_name_${language.value}`].substring(
        0,
        vw < 640 ? 20 : 200
      );
    }),
    datasets: Object.values(datasets),
  };
});

// Data validation
const validateCapabilityData = computed(() => {
  return sortedCapabilities.value.every(
    (capability) =>
      capability.userTargetImpact &&
      capability.userTargetImpact[selectedAspect.value]
  );
});

// Watch for data issues
watch(validateCapabilityData, (isValid) => {
  if (!isValid) {
    console.warn("Invalid capability data detected");
  }
});

</script>
