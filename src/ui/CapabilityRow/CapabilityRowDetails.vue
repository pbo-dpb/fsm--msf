<template>
  <CapabilityRowDescription :capability="capability" />

  <div
    v-if="specificNote"
    class="prose prose-sm font-semibold bg-yellow-50 border border-yellow-300 dark:bg-yellow-950 dark:border-yellow-700 rounded p-2"
  >
    <p>* {{ specificNote }}</p>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { storeToRefs } from "pinia";
import { useLanguageStore } from "../../stores/languageStore";
import CapabilityRowDescription from "./CapabilityRowDescription.vue";
import { Capability } from "../../models/Capability";

const props = defineProps({
  capability: {
    type: Capability,
    required: true,
  },
});

const languageStore = useLanguageStore();
const { language } = storeToRefs(languageStore);

const specificNote = computed(
  () => props.capability[`specific_note_${language.value}`] ?? null
);
</script>
