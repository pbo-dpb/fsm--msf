<template>
    <section class="font-semibold border border-gray-300 p-4 rounded mb-16 bg-gray-100 dark:bg-gray-950">
        <div class="font-mono mb-4 text-gray-800 dark:text-white text-center border-b border-gray-300 pb-2">
            DEBUG 🔧
        </div>
        <div class="flex flex-row justify-between">
            <legend class="w-1/3">
                <template v-if="!currentDebugFileModifiedDate">
                    <a :href="payloadUrl" class="text-blue-800 dark:text-blue-200 underline">XLSX</a> overwrite<br />
                </template>
                <span v-else class="text-green-800 dark:text-green-200">Loaded: {{ currentDebugFileModifiedDate
                    }}</span>
                <input type="file" name="file" @change="handleDebugFile" ref="debugFileInput" />
            </legend>
            <button @click="toggleLanguage" class="w-12 border border-gray-800 p-2 rounded">
                {{ language === "en" ? "fr" : "en" }}
            </button>
        </div>
    </section>
</template>
<script setup>
import { ref } from "vue";
import { storeToRefs } from "pinia";

import PayloadUrl from "../assets/payload.xlsx?url";

import { useLanguageStore } from "../stores/languageStore";
import { useMainStore } from "../stores/mainStore";

const languageStore = useLanguageStore();
const mainStore = useMainStore();

const { language } = storeToRefs(languageStore);

const debugFileInput = ref(null);
const payloadUrl = ref(PayloadUrl);
const currentDebugFileModifiedDate = ref(null);


// Methods
const toggleLanguage = () => {
    languageStore.$patch({ language: language.value === "en" ? "fr" : "en" });
};

const handleDebugFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
        const errors = await mainStore.instanciateStore(file);
        if (errors) {
            console.error("Loading errors:", errors);
        }
        currentDebugFileModifiedDate.value = file.lastModifiedDate.toLocaleString();
    } finally {
        debugFileInput.value.value = null;
    }
};

</script>