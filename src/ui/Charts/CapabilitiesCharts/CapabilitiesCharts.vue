<template>
    <div class="w-full flex flex-col gap-2">
        <AspectChart :aspect="settings_selectedAspect"></AspectChart>
    </div>
</template>
  
<script>
import { mapState } from 'pinia'
import store from '../../../Store';
import AspectChart from './AspectChart.vue';

export default {
    components: { AspectChart },
    computed: {
        ...mapState(store, ["strings", "settings_selectedAspect"]),
    },

}
</script>