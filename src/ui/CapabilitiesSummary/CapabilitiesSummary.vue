<template>
    <div class="flex flex-col gap-4">

        <h2 class="text-2xl font-thin flex flex-col gap-1 -mt-4">{{
            strings[`impact_chart_title`] }}
        </h2>

        <Charts></Charts>


        <!--<h2 class="text-2xl font-thin flex flex-col gap-1 pt-4">{{
            strings[`impact_facet_label_env_overhead`] }}
        </h2>
        <OverheadChart></OverheadChart>-->


    </div>
</template>
<script>

import { mapState } from 'pinia'
import store from '../../Store';
import Charts from "../Charts/CapabilitiesCharts/Charts.vue"
/*import OverheadChart from '../Charts/OverheadChart/OverheadChart.vue';*/

export default {
    computed: {
        ...mapState(store, ["strings", "settings_selectedAspect", "language", "vars"]),
    },
    data() {
        return {
            facetsOfInterest: ['total']
        }
    },
    components: { /*OverheadChart,*/ Charts }
}

</script>