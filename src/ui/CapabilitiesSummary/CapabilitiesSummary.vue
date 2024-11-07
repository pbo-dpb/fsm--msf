<template>
  <div class="flex flex-col gap-4">
    <h2 class="text-2xl font-thin flex flex-col gap-1 -mt-4">
      {{ strings.impact_chart_title }}
    </h2>

    <CapabilitiesCharts></CapabilitiesCharts>

    <!--
    <h2 class="text-2xl font-thin flex flex-col gap-1 pt-4">
      {{ strings.impact_facet_label_env_overhead }}
    </h2>
    <OverheadChart></OverheadChart>
    -->
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useLanguageStore } from '../../stores/languageStore';
import { useImpactStore } from '../../stores/impactStore';
import { useVarsStore } from '../../stores/varsStore';
import CapabilitiesCharts from '../Charts/CapabilitiesCharts/CapabilitiesCharts.vue';
// import OverheadChart from '../Charts/OverheadChart/OverheadChart.vue';

// Initialize stores
const languageStore = useLanguageStore();
const impactStore = useImpactStore();
const varsStore = useVarsStore();

// Get reactive refs from stores
const { strings, language } = storeToRefs(languageStore);
const { settings_selectedAspect } = storeToRefs(impactStore);
const { vars } = storeToRefs(varsStore);

// Local state
const facetsOfInterest = ref(['total']);
</script>

<style scoped>
/* Add any scoped styles here if needed */
</style>