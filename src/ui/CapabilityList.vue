<template>
  <section class="flex flex-col gap-4 w-full">
    <CapabilityGroup 
      v-for="environmentId in environmentIds" 
      :key="environmentId"
      :environmentId="environmentId" 
    />
  </section>
</template>

<script setup>
import { computed } from "vue";
import { storeToRefs } from "pinia";
import { useEnvironmentStore } from "../stores/environmentStore";
import CapabilityGroup from "./CapabilityRow/CapabilityGroup.vue";

const environmentStore = useEnvironmentStore();
const { environments } = storeToRefs(environmentStore);

const environmentIds = computed(() => {
  return environments.value.map(env => env.id);
});
</script>