<template>
    <div class="bg-gray-100 dark:bg-gray-900 flex flex-col gap-4 w-full h-full p-4">

        <h2 class="text-2xl font-thin text-center">{{ strings.summary_title }}</h2>

        <SummaryAspect aspect="cost"></SummaryAspect>
        <SummaryAspect aspect="personnel"></SummaryAspect>


    </div>
</template>
<script>

import { mapState } from 'pinia'
import store from '../../Store';
import SummaryAspect from './SummaryAspect.vue';

export default {
    computed: {
        ...mapState(store, ["strings"]),
    },
    components: { SummaryAspect }
}

</script>