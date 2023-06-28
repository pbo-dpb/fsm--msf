<template>
    <div v-if="environment" class="flex flex-col gap-4 ">

        <h3 class="text-lg font-thin">{{ environment?.display_name_en }}</h3>
        <section class="flex flex-col gap-2 w-full ">
            <SummaryAspect :group="group" aspect="cost" :facets-of-interest="facetsOfInterest"></SummaryAspect>
            <SummaryAspect :group="group" aspect="personnel" :facets-of-interest="facetsOfInterest"></SummaryAspect>
        </section>

    </div>
</template>
<script>
import SummaryAspect from './SummaryAspect.vue';

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
    },
    components: { SummaryAspect }
}
</script>