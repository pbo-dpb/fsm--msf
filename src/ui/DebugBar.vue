<template>
    <section
        class="mb-16 rounded-sm border border-solid border-gray-300 bg-gray-100 p-4 font-semibold dark:bg-gray-950">
        <div
            class="mb-4 border-b border-solid border-gray-300 pb-2 text-center font-mono text-gray-800 dark:text-white">
            DEBUG 🔧
        </div>
        <div class="flex flex-row justify-between">
            <legend class="w-1/3">
                <template v-if="!currentDebugFileModifiedDate">
                    <a
                        :href="payloadUrl"
                        class="text-blue-800 underline dark:text-blue-200"
                        >XLSX</a
                    >
                    overwrite<br />
                </template>
                <span
                    v-else
                    class="text-green-800 dark:text-green-200"
                    >Loaded: {{ currentDebugFileModifiedDate }}</span
                >
                <input
                    type="file"
                    name="file"
                    @change="handleDebugFile"
                    ref="debugFileInput" />
            </legend>
            <button
                @click="toggleLanguage"
                class="w-12 rounded-sm border border-solid border-gray-800 p-2">
                {{ language === "en" ? "fr" : "en" }}
            </button>
        </div>
    </section>
</template>
<script setup>
    import { ref, watch, onMounted } from "vue";
    import { storeToRefs } from "pinia";
    import WrapperEventDispatcher from "../WrapperEventDispatcher.js";

    import PayloadUrl from "../assets/payload.xlsx?url";

    import { useLanguageStore } from "../stores/languageStore";
    import { useMainStore } from "../stores/mainStore";

    const languageStore = useLanguageStore();
    const mainStore = useMainStore();

    const { language } = storeToRefs(languageStore);

    const debugFileInput = ref(null);
    const payloadUrl = ref(PayloadUrl);
    const currentDebugFileModifiedDate = ref(null);

    const updatePageTitle = () => {
        const pageTitle = language.value === "fr" ? "MSF" : "FSM";
        new WrapperEventDispatcher(pageTitle, null).dispatch();
    };

    // Watchers
    watch(language, updatePageTitle);

    // Methods
    const toggleLanguage = () => {
        languageStore.$patch({
            language: language.value === "en" ? "fr" : "en",
        });
    };

    const handleDebugFile = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            const errors = await mainStore.instanciateStore(file);
            if (errors) {
                console.error("Loading errors:", errors);
            }
            currentDebugFileModifiedDate.value =
                file.lastModifiedDate.toLocaleString();
        } finally {
            debugFileInput.value.value = null;
        }
    };

    // Lifecycle hooks
    onMounted(async () => {
        updatePageTitle();
    });
</script>
