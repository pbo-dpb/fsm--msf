<template>
    <div class="flex flex-col gap-4">


        <h2 class="text-2xl font-thin flex flex-col gap-1">{{
            strings[`summary_title`] }}
        </h2>

        <GlobalSummaryChart></GlobalSummaryChart>

        <h3 class="text-xl font-thin flex flex-col gap-1">{{
            strings[`impact_cost_title`] }}
        </h3>
        <TotalsTable :facets-of-interest="facetsOfInterest" aspect="cost"></TotalsTable>

        <h3 class="text-xl font-thin flex flex-col gap-1">{{
            strings[`impact_personnel_title`] }}
        </h3>
        <TotalsTable :facets-of-interest="facetsOfInterest" aspect="personnel"></TotalsTable>





    </div>
</template>
<script>

import { mapState } from 'pinia'
import store from '../../Store';
import TotalsTable from './TotalsTable.vue';
import GlobalSummaryChart from '../Charts/GlobalSummaryChart/GlobalSummaryChart.vue';

export default {
    computed: {
        ...mapState(store, ["strings", "settings_selectedAspect", "language", "vars"]),
    },
    data() {
        return {
            facetsOfInterest: ['total']
        }
    },
    components: { TotalsTable, GlobalSummaryChart }
}

</script>