<template>
    <div class="w-full flex flex-col gap-2">
        <EnvironmentCapabilitiesAspectChart v-for="environment in environments" :environment="environment"
            :aspect="settings_selectedAspect"></EnvironmentCapabilitiesAspectChart>
    </div>
</template>
  
<script>
import { mapState } from 'pinia'
import store from '../../../Store';
import EnvironmentCapabilitiesAspectChart from './EnvironmentCapabilitiesAspectChart.vue';

export default {
    components: { EnvironmentCapabilitiesAspectChart },
    computed: {
        ...mapState(store, ["strings", "settings_selectedAspect", "environments"]),
    },

}
</script>