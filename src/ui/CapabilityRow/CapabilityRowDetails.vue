<template>
    <CapabilityRowDescription :capability="capability" />

    <div
        v-if="specificNote"
        class="prose prose-sm rounded-sm border border-solid border-yellow-300 bg-yellow-50 p-2 font-semibold dark:border-yellow-700 dark:bg-yellow-950">
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
        () => props.capability[`specific_note_${language.value}`] ?? null,
    );
</script>
