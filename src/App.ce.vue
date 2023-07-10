<template>
  <section class="bg-blue-100 text-blue-800 font-semibold border border-blue-300 p-4 flex flex-col gap-4 rounded mb-16"
    v-if="debug">{{
      strings.debug_notice }}

    <legend>Select custom force structure model data (.csv).<br><input type="file" name="file"
        @change="handleDebugTsvFile" /></legend>

  </section>

  <div class="flex flex-row justify-center border-2 border-blue-100 dark:border-blue-900 rounded p-2 mb-8">
    <AspectSelector></AspectSelector>
  </div>


  <Charts></Charts>


  <div class="flex flex-col lg:grid lg:grid-cols-3 gap-8 my-8 w-full">

    <div class="col-span-2 flex flex-col gap-8">
      <CapabilityList v-if="capabilities"></CapabilityList>
    </div>

    <div class="lg:border-l border-gray-100 lg:pl-8">

      <Summary></Summary>

    </div>

  </div>
</template>

<script>
import store from './Store'

import WrapperEventDispatcher from "./WrapperEventDispatcher.js"
import PayloadCsvUrl from "./assets/payload.csv?url"
import { mapState } from 'pinia'
import CapabilityList from "./ui/CapabilityList.vue";
import Summary from './ui/Summary/Summary.vue';
import Charts from './ui/Charts/CapabilitiesCharts/Charts.vue';
import AspectSelector from "./ui/AspectSelector/AspectSelector.vue"


const language = document.documentElement.lang;

export default {
  data() {
    return {
      language: language,
    };
  },
  computed: {
    ...mapState(store, ['strings', 'capabilities', 'environments']),
    debug() {
      return this.$root.debug;
    }
  },
  components: {
    CapabilityList,
    Summary,
    Charts,
    AspectSelector
  },
  mounted() {
    const pageTitle = this.language === 'fr' ? 'MSF' : 'FSM';
    (new WrapperEventDispatcher(pageTitle, null)).dispatch();
    if (true || !this.debug) {
      fetch(PayloadCsvUrl)
        .then(response => response.text())
        .then(data => {
          store().instanciateCapabilitiesFromCsv(data)
        })
    }
  },

  methods: {
    async handleDebugTsvFile(e) {

      let rawText = await e.target.files[0].text();
      store().instanciateCapabilitiesFromCsv(rawText)
    },

  }
};
</script>
<style>
@import "./index.css";
</style>
