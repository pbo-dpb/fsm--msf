<template>
  <div class="flex flex-col gap-4" v-if="environment">
    <h2 class="text-2xl font-thin">
      {{ environment[`display_name_${language}`] }}
    </h2>
    <section class="flex flex-col gap-1 w-full">
      <CapabilityRow
        v-for="capability in capabilities"
        :key="capability.id"
        :capability="capability"
      />
    </section>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { storeToRefs } from "pinia";
import CapabilityRow from "./CapabilityRow.vue";
import { useLanguageStore } from "../../stores/languageStore";
import { useEnvironmentStore } from "../../stores/environmentStore";
import { useCapabilityStore } from "../../stores/capabilityStore";

const props = defineProps({
  environmentId: {
    type: String,
    required: true,
  }
});

const languageStore = useLanguageStore();
const environmentStore = useEnvironmentStore();
const capabilityStore = useCapabilityStore();
const { language } = storeToRefs(languageStore);
const { groupedCapabilities } = storeToRefs(capabilityStore);

const environment = computed(() => {
  return environmentStore.environments.find(env => env.id === props.environmentId);
});

const capabilities = computed(() => {
  const groupCaps = groupedCapabilities.value[props.environmentId] || [];
  return [...groupCaps].sort((a, b) =>
    a[`display_name_${language.value}`].localeCompare(
      b[`display_name_${language.value}`]
    )
  );
});
</script>