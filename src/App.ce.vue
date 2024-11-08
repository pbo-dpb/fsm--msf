<template>
  <div ref="root">
    <DebugBar v-if="shouldDisplayDebugBar"></DebugBar>


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
          class="col-span-2 lg:border-l bg-gray-100 dark:bg-gray-900 flex flex-col gap-4 w-full h-full border border-gray-300">
          <div class="flex flex-row justify-center bg-gray-50 p-4 border-b border-gray-300">
            <AspectSelector />
          </div>

          <div class="p-4">
            <CapabilitiesSummary />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, defineAsyncComponent } from "vue";
import { storeToRefs } from "pinia";
import PayloadUrl from "./assets/payload.xlsx?url";
import CapabilityList from "./ui/CapabilityList.vue";
import CapabilitiesSummary from "./ui/CapabilitiesSummary/CapabilitiesSummary.vue";
import AspectSelector from "./ui/AspectSelector/AspectSelector.vue";
import CollapsibleIntro from "./ui/CollapsibleIntro.vue";
import LoadingIndicator from "./ui/LoadingIndicator.vue";
import GlobalSummary from "./ui/GlobalSummary/GlobalSummary.vue";
import WrapperEventDispatcher from "./WrapperEventDispatcher.js";
const DebugBar = defineAsyncComponent(() =>
  import('./ui/DebugBar.vue')
)

// Import individual stores
import { useLanguageStore } from "./stores/languageStore";
import { useCapabilityStore } from "./stores/capabilityStore";
import { useMainStore } from "./stores/mainStore";

// Initialize stores
const languageStore = useLanguageStore();
const capabilityStore = useCapabilityStore();
const mainStore = useMainStore();

// Get store refs
const { language } = storeToRefs(languageStore);
const { capabilities } = storeToRefs(capabilityStore);


// Refs
const root = ref(null);
const shouldDisplayDebugBar = ref(false);
const payloadUrl = ref(PayloadUrl);
const isLoading = ref(true);


const updatePageTitle = () => {
  const pageTitle = language.value === "fr" ? "MSF" : "FSM";
  new WrapperEventDispatcher(pageTitle, null).dispatch();
};

// Watchers
watch(language, updatePageTitle);

// Lifecycle hooks
onMounted(async () => {


  shouldDisplayDebugBar.value = root.value.getRootNode().host.getAttribute("debug") === "true";

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