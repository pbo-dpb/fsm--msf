<template>
  <figure class="flex flex-col gap-4">
    <div class="flex flex-col gap-1">
      <CapabilityRowBreakdownAspect :capability="capability" aspect="cost">
      </CapabilityRowBreakdownAspect>
    </div>

    <div class="flex flex-col gap-1">
      <CapabilityRowBreakdownAspect :capability="capability" aspect="personnel"></CapabilityRowBreakdownAspect>
    </div>
  </figure>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { Capability } from "../../models/Capability";
import { useLanguageStore } from "../../stores/languageStore";
import { useImpactStore } from "../../stores/impactStore";
import { useVarsStore } from "../../stores/varsStore";
import CapabilityRowBreakdownAspect from "./CapabilityRowBreakdownAspect.vue";

const props = defineProps({
  capability: {
    type: Capability,
    required: true,
  },
});

const languageStore = useLanguageStore();
const impactStore = useImpactStore();
const varsStore = useVarsStore();

const { language, strings } = storeToRefs(languageStore);
const { settings_perUnitDisplay } = storeToRefs(impactStore);
const { vars } = storeToRefs(varsStore);
</script>
