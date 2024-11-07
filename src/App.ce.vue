<template>
  <section
    class="font-semibold border border-gray-300 p-4 rounded mb-16 bg-gray-100 dark:bg-gray-950"
  >
    <div
      class="font-mono mb-4 text-gray-800 dark:text-white text-center border-b border-gray-300 pb-2"
    >
      DEBUG 🔧
    </div>
    <div class="flex flex-row justify-between">
      <legend class="w-1/3">
        <a :href="payloadUrl">XLSX</a> overwrite<br />
        <input
          type="file"
          name="file"
          @change="handleDebugFile"
          ref="debugFileInput"
        />
      </legend>
      <button
        @click="toggleLanguage"
        class="w-12 border border-gray-800 p-2 rounded"
      >
        {{ language === "en" ? "fr" : "en" }}
      </button>
    </div>
  </section>

  <LoadingIndicator v-if="!capabilities" class="h-8 w-8" />

  <div v-else>
    <div class="flex flex-col gap-4">
      <CollapsibleIntro />
      <GlobalSummary />
    </div>

    <div class="flex flex-col lg:grid lg:grid-cols-3 gap-8 my-8 w-full">
      <div class="col-span-1 flex flex-col gap-8">
        <CapabilityList v-if="capabilities" />
      </div>

      <div
        class="col-span-2 lg:border-l bg-gray-100 dark:bg-gray-900 flex flex-col gap-4 w-full h-full border border-gray-300"
      >
        <div
          class="flex flex-row justify-center bg-gray-50 p-4 border-b border-gray-300"
        >
          <AspectSelector />
        </div>

        <div class="p-4">
          <CapabilitiesSummary />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { storeToRefs } from "pinia";
import PayloadUrl from "./assets/payload.xlsx?url";
import CapabilityList from "./ui/CapabilityList.vue";
import CapabilitiesSummary from "./ui/CapabilitiesSummary/CapabilitiesSummary.vue";
import AspectSelector from "./ui/AspectSelector/AspectSelector.vue";
import CollapsibleIntro from "./ui/CollapsibleIntro.vue";
import LoadingIndicator from "./ui/LoadingIndicator.vue";
import GlobalSummary from "./ui/GlobalSummary/GlobalSummary.vue";
import WrapperEventDispatcher from "./WrapperEventDispatcher.js";

// Import individual stores
import { useLanguageStore } from "./stores/languageStore";
import { useCapabilityStore } from "./stores/capabilityStore";
import { useEnvironmentStore } from "./stores/environmentStore";
import { useVarsStore } from "./stores/varsStore";
import { useMainStore } from "./stores/mainStore";

// Initialize stores
const languageStore = useLanguageStore();
const capabilityStore = useCapabilityStore();
const environmentStore = useEnvironmentStore();
const varsStore = useVarsStore();
const mainStore = useMainStore();

// Get store refs
const { language } = storeToRefs(languageStore);
const { capabilities } = storeToRefs(capabilityStore);
const { environments } = storeToRefs(environmentStore);
const { vars } = storeToRefs(varsStore);

// Refs
const debugFileInput = ref(null);
const payloadUrl = ref(PayloadUrl);
const isLoading = ref(true);

// Methods
const handleDebugFile = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  isLoading.value = true;
  try {
    const errors = await mainStore.instanciateStore(file);
    if (errors) {
      console.error("Loading errors:", errors);
    }
  } finally {
    isLoading.value = false;
    debugFileInput.value.value = null;
  }
};

const toggleLanguage = () => {
  languageStore.$patch({ language: language.value === "en" ? "fr" : "en" });
};

const updatePageTitle = () => {
  const pageTitle = language.value === "fr" ? "MSF" : "FSM";
  new WrapperEventDispatcher(pageTitle, null).dispatch();
};

// Watchers
watch(language, updatePageTitle);

// Lifecycle hooks
onMounted(async () => {
  isLoading.value = true;
  try {
    const response = await fetch(payloadUrl.value);
    const blob = await response.blob();
    const errors = await mainStore.instanciateStore(blob);

    if (errors) {
      console.error("Loading errors:", errors);
    }
  } catch (error) {
    console.error("Failed to load initial data:", error);
  } finally {
    isLoading.value = false;
  }

  updatePageTitle();
});
</script>

<style>
@import "./style.css";
</style>