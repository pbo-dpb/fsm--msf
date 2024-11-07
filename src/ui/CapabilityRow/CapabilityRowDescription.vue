<template>
  <div
    v-if="description"
    class="prose-sm dark:prose-invert max-w-none prose-p:leading-tight"
  >
    {{ description }}
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { Capability } from "../../models/Capability";
import { storeToRefs } from "pinia";
import { useLanguageStore } from "../../stores/languageStore";

const props = defineProps({
  capability: {
    type: Capability,
    required: true,
  },
});

const languageStore = useLanguageStore();
const { language } = storeToRefs(languageStore);

const description = computed(() => {
  return props.capability.description?.[language.value] ?? null;
});
</script>