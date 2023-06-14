<template>
  <section class="bg-red-900 text-white font-semibold p-4 flex flex-col gap-4 rounded mb-4" v-if="debug">{{
    strings.debug_notice }}

    <legend>Select custom force structure model data (.tsv)<br><input type="file" name="file"
        @change="handleDebugTsvFile" /></legend>
  </section>

  <div class="flex flex-col justify-center items-center gap-8">

    <section class="flex flex-col gap-2">
      <div v-for="capability in capabilities" class="">{{ capability.name_en }}</div>
    </section>

  </div>
</template>

<script>
import WrapperEventDispatcher from "./WrapperEventDispatcher.js"
import PayloadTsvUrl from "./assets/payload.tsv?url"
import { mapState } from 'pinia'
import store from './Store'


const language = document.documentElement.lang;

export default {
  data() {
    return {
      language: language,
    };
  },
  computed: {
    ...mapState(store, ['strings', 'capabilities']),
    debug() {
      return this.$root.debug;
    }
  },
  components: {
  },
  mounted() {
    const pageTitle = this.language === 'fr' ? 'MSF' : 'FSM';
    (new WrapperEventDispatcher(pageTitle, null)).dispatch();

    if (!this.debug) {
      fetch(PayloadTsvUrl)
        .then(response => response.text())
        .then(data => {
          store().instanciateCapabilitiesFromTsv(data)
        })
    }
  },
  methods: {
    async handleDebugTsvFile(e) {

      let rawText = await e.target.files[0].text();
      store().instanciateCapabilitiesFromTsv(rawText)
    }
  }
};
</script>
<style>
@import "./index.css";
</style>
