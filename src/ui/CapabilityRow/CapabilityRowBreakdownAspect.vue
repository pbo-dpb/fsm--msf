<template>
  <div class="flex flex-col gap-2">
    <h4 class="font-semibold">{{ strings[`impact_${aspect}_title`] }}</h4>
    
    <dl class="grid grid-cols-2 gap-1 text-sm pl-4">
      <template v-for="(facet, key) in capability[aspect]">
        <template v-if="['direct', 'indirect', 'env_overhead'].includes(key)">
          <dt class="font-semibold text-gray-800 dark:text-gray-200">
            {{ strings[`impact_facet_label_${key}`] }}
          </dt>
          <dd class="lining-nums inline-flex gap-2">
            <span :class="{ 'line-through decoration-gray-500': shouldDisplayImpactDiff }">
              {{ getValForFacet(key, false) }}
            </span>
            <span v-if="shouldDisplayImpactDiff" class="text-blue-800 dark:text-blue-200">
              {{ getValForFacet(key, true) }}
            </span>
          </dd>
        </template>
      </template>
    </dl>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { Capability } from '../../models/Capability';
import Localizer from '../../Localizer';
import { storeToRefs } from 'pinia';
import { useLanguageStore } from "../../stores/languageStore";
import { useImpactStore } from "../../stores/impactStore";

const props = defineProps({
  capability: {
    type: Capability,
    required: true
  },
  aspect: {
    type: String,
    required: true,
    validator: (value) => ['personnel', 'cost'].includes(value),
  },
});

const languageStore = useLanguageStore();
const impactStore = useImpactStore();

const { language, strings } = storeToRefs(languageStore);
const { settings_perUnitDisplay } = storeToRefs(impactStore);

const shouldDisplayImpactDiff = computed(() => {
  return props.capability.hasUserTarget && !settings_perUnitDisplay.value;
});

function formatValue(value) {
  if (props.aspect === 'cost') {
    return Localizer.formatNumber(value, language.value, 'currency');
  }
  return Localizer.formatNumber(value, language.value);
}

function getValForFacet(facet, userTarget = false) {
  if (settings_perUnitDisplay.value) {
    return formatValue(props.capability.impactPerUnit[props.aspect][facet]);
  }
  return formatValue(userTarget ? props.capability.userTargetImpact[props.aspect][facet] : props.capability[props.aspect][facet]);
}
</script>