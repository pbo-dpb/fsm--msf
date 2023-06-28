<template>
    <section class="flex flex-col gap-4 w-full ">

        <ForcesBreakdownEnvironment v-for="group in groupedCapabilities" :group="group"
            :facets-of-interest="facetsOfInterest"></ForcesBreakdownEnvironment>


    </section>
</template>
<script>
import { mapState } from 'pinia'
import store from '../../Store'
import ForcesBreakdownEnvironment from './ForcesBreakdownEnvironment.vue';

export default {
    computed: {
        ...mapState(store, ["strings", "groupedCapabilities"]),
    },
    props: {
        facetsOfInterest: {
            type: Array,
            required: true,
        }
    },
    components: { ForcesBreakdownEnvironment }
}
</script>