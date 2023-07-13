<template>
    <div v-if="environment" class="flex flex-col gap-2 ">


        <section class="flex flex-col gap-2 w-full ">
            <SummaryAspect :group="group" :aspect="settings_selectedAspect" :facets-of-interest="facetsOfInterest">
                <h4 class="font-thin">{{
                    environment?.display_name_en }}</h4>
            </SummaryAspect>
        </section>

    </div>
</template>
<script>
import SummaryAspect from './SummaryAspect.vue';
import { mapState } from 'pinia'
import store from '../../Store';
export default {
    props: {
        group: {
            type: Array,
            required: true
        },
        facetsOfInterest: {
            type: Array,
            required: true,
        }
    },
    computed: {
        environment() {
            return this.group[0]?.environment ?? null;
        },
        ...mapState(store, ["settings_selectedAspect"]),

    },
    components: { SummaryAspect }
}
</script>