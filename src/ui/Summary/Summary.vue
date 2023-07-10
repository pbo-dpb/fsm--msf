<template>
    <div class="bg-gray-100 dark:bg-gray-900 flex flex-col gap-4 w-full h-full p-4">


        <h2 class="text-2xl font-thin text-center flex flex-col gap-1">{{
            strings[`impact_facet_label_${facetsOfInterest[0]}`] }}
        </h2>

        <OverheadChart></OverheadChart>

        <div>
            <SummaryAspect aspect="cost" :facets-of-interest="facetsOfInterest"></SummaryAspect>
            <SummaryAspect aspect="personnel" :facets-of-interest="facetsOfInterest"></SummaryAspect>
        </div>

        <div class="border-gray-300 dark:border-gray-700 border-t-2 pt-4">
            <ForcesBreakdown :facets-of-interest="facetsOfInterest"></ForcesBreakdown>
        </div>




    </div>
</template>
<script>

import { mapState } from 'pinia'
import store from '../../Store';
import SummaryAspect from './SummaryAspect.vue';
import ForcesBreakdown from './ForcesBreakdown.vue';

import OverheadChart from '../Charts/OverheadChart/OverheadChart.vue';

export default {
    computed: {
        ...mapState(store, ["strings"]),
    },
    data() {
        return {
            facetsOfInterest: ['env_overhead']
        }
    },
    components: { SummaryAspect, ForcesBreakdown, OverheadChart }
}

</script>