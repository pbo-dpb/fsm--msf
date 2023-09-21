<template>
    <div class="flex flex-col gap-4">

        <h2 class="text-2xl font-thin flex flex-col gap-1 -mt-4">{{
            strings[`summary_title`] }}
        </h2>

        <Charts></Charts>

        <div>
            <SummaryAspect :aspect="settings_selectedAspect" :facets-of-interest="facetsOfInterest">
                <h3 class="text-xl font-thin ">{{
                    strings[`impact_facet_label_${facetsOfInterest[0]}`] }}
                </h3>
            </SummaryAspect>

        </div>

        <div class="pl-4">
            <ForcesBreakdown :facets-of-interest="facetsOfInterest"></ForcesBreakdown>
        </div>
        <p class="border-l-2 border-gray-200 dark:border-gray-700 dark:border-blue-700 pl-2 text-gray-700 text-sm">{{
            vars[`overhead_and_totals_rounding_note_${settings_selectedAspect}`][language]
        }}
        </p>



        <h2 class="text-2xl font-thin flex flex-col gap-1 pt-4">{{
            strings[`impact_facet_label_env_overhead`] }}
        </h2>
        <OverheadChart></OverheadChart>


    </div>
</template>
<script>

import { mapState } from 'pinia'
import store from '../../Store';
import SummaryAspect from './SummaryAspect.vue';
import ForcesBreakdown from './ForcesBreakdown.vue';
import Charts from "../Charts/CapabilitiesCharts/Charts.vue"
import OverheadChart from '../Charts/OverheadChart/OverheadChart.vue';

export default {
    computed: {
        ...mapState(store, ["strings", "settings_selectedAspect", "language", "vars"]),
    },
    data() {
        return {
            facetsOfInterest: ['total']
        }
    },
    components: { SummaryAspect, ForcesBreakdown, OverheadChart, Charts }
}

</script>