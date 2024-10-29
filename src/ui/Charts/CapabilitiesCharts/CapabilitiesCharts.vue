<template>
  <div class="w-full flex flex-col gap-2">
    <CapabilitiesEnvironmentCharts
      v-for="environment in environments"
      :key="environment.id"
      :environment="environment"
      :aspect="selectedAspect"
    />
    <div v-if="!environments?.length" class="text-gray-500 text-center py-4">
      {{ strings?.no_environments_message }}
    </div>
  </div>
</template>

<script setup>
import { computed, watch } from "vue";
import { storeToRefs } from "pinia";
import { useStore } from "../../../stores/index";
import { useEnvironmentStore } from "../../../stores/environmentStore";
import { useImpactStore } from "../../../stores/impactStore";
import CapabilitiesEnvironmentCharts from "./CapabilitiesEnvironmentCharts.vue";

// Store setup
const store = useStore();
const environmentStore = useEnvironmentStore();
const impactStore = useImpactStore();

// Store refs
const { strings } = storeToRefs(store);
const { environments } = storeToRefs(environmentStore);
const { settings_selectedAspect: selectedAspect } = storeToRefs(impactStore);

// Optional: Validate environments data
const validateEnvironments = computed(() => {
  return environments.value?.every(
    (env) => env.id && typeof env.id === "string"
  );
});

// Optional: Watch for data issues
watch(validateEnvironments, (isValid) => {
  if (!isValid) {
    console.warn("Invalid environment data detected");
  }
});
</script>
