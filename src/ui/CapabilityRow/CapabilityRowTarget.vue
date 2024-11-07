<template>
  <div class="flex flex-col justify-center items-center">
    <div
      v-if="capability.userTargetDiff"
      class="bordered text-white print:text-black font-semibold text-xs px-1 py-.5 rounded-sm"
      :class="{
        'bg-gray-500': capability.userTargetDiff === 0,
        'bg-red-800': capability.userTargetDiff < 0,
        'bg-green-800': capability.userTargetDiff > 0,
      }"
    >
      <span v-if="capability.userTargetDiff">{{ userTargetDiff }} </span>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { storeToRefs } from "pinia";
import Localizer from "../../Localizer";
import { Capability } from "../../models/Capability";
import { useLanguageStore } from "../../stores/languageStore";

// Props
const props = defineProps({
  capability: {
    type: Capability,
    required: true,
  },
});

// Store
const languageStore = useLanguageStore();
const { language } = storeToRefs(languageStore);

// Computed properties
const currentTarget = computed(() => {
  return props.capability.userTargetDiff
    ? Localizer.formatNumber(props.capability.current, language.value)
    : Localizer.formatNumber(
        props.capability.current,
        language.value,
        props.capability.current_unit
      );
});

const userTargetDiff = computed(() => {
  return (
    (props.capability.userTargetDiff > 0 ? "+" : "") +
    Localizer.formatNumber(
      props.capability.userTargetDiff,
      language.value,
      props.capability.current_unit
    )
  );
});
</script>
