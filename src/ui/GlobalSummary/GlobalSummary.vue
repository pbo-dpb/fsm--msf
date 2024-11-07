<template>
  <div class="flex flex-col gap-4">
    <h2 class="text-2xl font-thin flex flex-col gap-1">
      {{ strings[`summary_title`] }}
    </h2>

    <GlobalSummaryChart></GlobalSummaryChart>

    <h3 class="text-xl font-thin flex flex-col gap-1">
      {{ strings[`impact_cost_title`] }}
    </h3>
    <TotalsTable
      :facets-of-interest="facetsOfInterest"
      aspect="cost"
    ></TotalsTable>

    <h3 class="text-xl font-thin flex flex-col gap-1">
      {{ strings[`impact_personnel_title`] }}
    </h3>
    <TotalsTable
      :facets-of-interest="facetsOfInterest"
      aspect="personnel"
    ></TotalsTable>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { storeToRefs } from "pinia";
import { useLanguageStore } from "../../stores/languageStore";
import TotalsTable from "./TotalsTable.vue";
import GlobalSummaryChart from "../Charts/GlobalSummaryChart/GlobalSummaryChart.vue";

// Initialize individual stores
const languageStore = useLanguageStore();

// Get required refs from each store
const { strings } = storeToRefs(languageStore);

const facetsOfInterest = ref(["total"]);
</script>
