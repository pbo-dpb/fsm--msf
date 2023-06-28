<template>
    <div class="bg-gray-100 dark:bg-gray-900 flex flex-col gap-4 w-full h-full p-4">

        <h2 class="text-2xl font-thin text-center flex flex-col gap-1">{{ strings.summary_title }}
            <div v-if="facetsOfInterest.length === 1" class="text-lg text-gray-800 dark:text-gray-200">{{
                strings[`impact_facet_label_${facetsOfInterest[0]}`] }}</div>
        </h2>


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

export default {
    computed: {
        ...mapState(store, ["strings"]),
    },
    data() {
        return {
            facetsOfInterest: ['env_overhead']
        }
    },
    components: { SummaryAspect, ForcesBreakdown }
}

</script>