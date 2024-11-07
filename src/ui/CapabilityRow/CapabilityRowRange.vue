<template>
  <div class="w-full flex flex-col">
    <input
      type="range"
      :min="capability.user_editable.range_min"
      :max="capability.user_editable.range_max"
      :step="capability.user_editable.step"
      class="w-full"
      :id="uid"
      v-model="capability.state.user_target"
    />
    
    <div
      class="flex flex-row justify-between text-sm text-gray-600 dark:text-gray-400 select-none"
      aria-hidden="true"
    >
      <span v-for="tick in ticks" :key="tick">{{ tick }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { v4 as uuidv4 } from "uuid";
import Localizer from "../../Localizer";
import { storeToRefs } from "pinia";
import { useLanguageStore } from "../../stores/languageStore";
import { Capability } from "../../models/Capability";

const props = defineProps({
  capability: {
    type: Capability,
    required: true,
  },
});

const languageStore = useLanguageStore();
const { language } = storeToRefs(languageStore);

const uid = ref(`crrange-${uuidv4()}`);

const ticks = computed(() => {
  if (props.capability.current_unit === "percent") {
    return [
      Localizer.formatNumber(
        -props.capability.user_editable.range,
        language.value,
        props.capability.current_unit
      ),
      Localizer.formatNumber(
        props.capability.current,
        language.value,
        props.capability.current_unit
      ),
      `+${Localizer.formatNumber(
        props.capability.user_editable.range,
        language.value,
        props.capability.current_unit
      )}`,
    ];
  }
  
  return [
    Localizer.formatNumber(
      props.capability.user_editable.range_min,
      language.value,
      props.capability.current_unit
    ),
    Localizer.formatNumber(
      props.capability.current,
      language.value,
      props.capability.current_unit
    ),
    Localizer.formatNumber(
      props.capability.user_editable.range_max,
      language.value,
      props.capability.current_unit
    ),
  ];
});
</script>