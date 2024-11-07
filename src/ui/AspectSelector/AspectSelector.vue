<template>
  <div class="flex flex-row">
    <AspectSelectorTabsButton
      @click="selectAspect('cost')"
      :active="selectedAspect === 'cost'"
    >
      {{ strings.tab_cost_title }}
    </AspectSelectorTabsButton>
    <AspectSelectorTabsButton
      @click="selectAspect('personnel')"
      :active="selectedAspect === 'personnel'"
    >
      {{ strings.tab_personnel_title }}
    </AspectSelectorTabsButton>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { storeToRefs } from "pinia";
import { useLanguageStore } from "../../stores/languageStore";
import { useImpactStore } from "../../stores/impactStore";
import AspectSelectorTabsButton from "./AspectSelectorTabsButton.vue";

// Initialize stores
const languageStore = useLanguageStore();
const impactStore = useImpactStore();

// Get reactive refs from stores
const { strings } = storeToRefs(languageStore);
const { settings_selectedAspect } = storeToRefs(impactStore);

// Computed property for cleaner template
const selectedAspect = computed(() => settings_selectedAspect.value);

// Method to handle aspect selection
const selectAspect = (aspect) => {
  settings_selectedAspect.value = aspect;
};
</script>
