<template>
    <div class="w-full flex flex-col gap-2">
        <div class="flex flex-row">
            <ChartAspectSelectorTabsButton @click="aspect = 'cost'" :active="aspect === 'cost'">{{
                strings.impact_cost_title }}
            </ChartAspectSelectorTabsButton>
            <ChartAspectSelectorTabsButton @click="aspect = 'personnel'" :active="aspect === 'personnel'">{{
                strings.impact_personnel_title }}
            </ChartAspectSelectorTabsButton>
        </div>
        <AspectChart :aspect="aspect"></AspectChart>
    </div>
</template>
  
<script>
import { mapState } from 'pinia'
import store from '../../Store';
import AspectChart from './AspectChart.vue';
import ChartAspectSelectorTabsButton from './ChartAspectSelectorTabsButton.vue';

export default {
    components: { AspectChart, ChartAspectSelectorTabsButton },
    computed: {
        ...mapState(store, ["strings"]),
    },
    data() {
        return {
            aspect: "cost"
        }
    }
}
</script>