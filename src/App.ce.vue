<template>
  <section class="font-semibold border border-gray-300 p-4 rounded mb-16 bg-gray-100 dark:bg-gray-950" v-if="debug">
    <div class="font-mono mb-4 text-gray-800 dark:text-white text-center border-b border-gray-300 pb-2">DEBUG 🔧‍</div>
    <div class="flex flex-row justify-between">

      <legend class="w-1/3"><a :href="payloadUrl">XLSX</a> overwrite<br><input type="file" name="file"
          @change="handleDebugFile" ref="debugFileInput" /></legend>

      <button @click="language = language == 'en' ? 'fr' : 'en'" class="w-12 border border-gray-800 p-2 rounded">{{
        language ==
        'en'
        ? 'fr' : 'en' }}</button>
    </div>
  </section>


  <LoadingIndicator v-if="!capabilities" class="h-8 w-8"></LoadingIndicator>
  <div v-else>

    <div class="flex flex-col gap-4">
      <CollapsibleIntro></CollapsibleIntro>
      <GlobalSummary></GlobalSummary>
    </div>


    <div class="flex flex-col lg:grid lg:grid-cols-3 gap-8 my-8 w-full ">

      <div class="col-span-1 flex flex-col gap-8">
        <CapabilityList v-if="capabilities"></CapabilityList>
      </div>

      <div
        class="col-span-2 lg:border-l  bg-gray-100 dark:bg-gray-900 flex flex-col gap-4 w-full h-full border border-gray-300">

        <div class="flex flex-row justify-center bg-gray-50 p-4 border-b border-gray-300">
          <AspectSelector></AspectSelector>
        </div>

        <div class="p-4">
          <CapabilitiesSummary></CapabilitiesSummary>
        </div>

      </div>

    </div>
  </div>
</template>

<script>
import store from './Store'

import WrapperEventDispatcher from "./WrapperEventDispatcher.js"
import PayloadUrl from "./assets/payload.xlsx?url"
import { mapState, mapWritableState } from 'pinia'
import CapabilityList from "./ui/CapabilityList.vue";
import CapabilitiesSummary from './ui/CapabilitiesSummary/CapabilitiesSummary.vue';
import AspectSelector from "./ui/AspectSelector/AspectSelector.vue"
import CollapsibleIntro from './ui/CollapsibleIntro.vue';
import LoadingIndicator from "./ui/LoadingIndicator.vue";
import GlobalSummary from "./ui/GlobalSummary/GlobalSummary.vue"


export default {
  data() {
    return {
      payloadUrl: PayloadUrl
    };
  },
  computed: {
    ...mapWritableState(store, ['language']),
    ...mapState(store, ['strings', 'capabilities', 'environments', 'vars']),
    debug() {
      return this.$root.debug;
    }
  },
  components: {
    CapabilityList,
    CapabilitiesSummary,
    AspectSelector,
    LoadingIndicator,
    CollapsibleIntro,
    GlobalSummary
  },
  mounted() {
    Promise.all(
      [this.payloadUrl].map(spreadsheetUrl => {
        return new Promise((resolve, reject) => {
          fetch(spreadsheetUrl)
            .then(response => response.blob())
            .then(blob => store().instanciateStore(blob))
            .then(() => {
              resolve();
            })
        });
      }));

    this.updatePageTitle()
  },

  methods: {
    handleDebugFile(e) {
      store().instanciateStore(e.target.files[0])
      this.$refs.debugFileInput.value = null;
    },
    updatePageTitle() {
      const pageTitle = this.language === 'fr' ? 'MSF' : 'FSM';
      (new WrapperEventDispatcher(pageTitle, null)).dispatch();
    }
  }
};
</script>
<style>
@import "./index.css";
</style>
