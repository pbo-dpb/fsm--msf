<template>
    <div class="w-full flex flex-col gap-2">
        <CapabilitiesEnvironmentCharts v-for="environment in environments" :environment="environment"
            :aspect="settings_selectedAspect"></CapabilitiesEnvironmentCharts>
    </div>
</template>
  
<script>
import { mapState } from 'pinia'
import store from '../../../Store';
import CapabilitiesEnvironmentCharts from './CapabilitiesEnvironmentCharts.vue';

export default {
    components: { CapabilitiesEnvironmentCharts },
    computed: {
        ...mapState(store, ["strings", "settings_selectedAspect", "environments"]),
    },

}
</script>