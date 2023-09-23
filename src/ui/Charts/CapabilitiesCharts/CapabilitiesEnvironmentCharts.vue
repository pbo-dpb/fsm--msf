<template>
    <div class="w-full flex flex-col gap-2">
        <h3 class="text-xl font-thin flex flex-col gap-1">{{ environment[`display_name_${language}`] }}</h3>

        <EnvironmentCapabilitiesAspectChart :environment="environment" :aspect="settings_selectedAspect">
        </EnvironmentCapabilitiesAspectChart>

        <EnvironmentOverheadChart :environment="environment" :aspect="settings_selectedAspect">
        </EnvironmentOverheadChart>
    </div>
</template>
  
<script>
import { mapState } from 'pinia'
import store from '../../../Store';
import EnvironmentCapabilitiesAspectChart from './EnvironmentCapabilitiesAspectChart.vue';
import EnvironmentOverheadChart from './EnvironmentOverheadChart.vue';

import { Environment } from '../../../models/Environment';

export default {
    components: { EnvironmentCapabilitiesAspectChart, EnvironmentOverheadChart },
    props: {
        environment: Environment,
        required: true
    },
    computed: {
        ...mapState(store, ["strings", "settings_selectedAspect", "language", "environments"]),
    },

}
</script>