<template>
    <div>
        <Switch v-model="settings_perUnitDisplay">{{ strings.impact_per_unit_toggle }}</Switch>
    </div>

    <figure class="flex flex-col lg:grid grid-cols-2">

        <div>
            <CapabilityRowBreakdownAspect :capability="capability" aspect="cost">
            </CapabilityRowBreakdownAspect>
        </div>

        <div>
            <CapabilityRowBreakdownAspect :capability="capability" aspect="personnel"></CapabilityRowBreakdownAspect>
        </div>


    </figure>
</template>
<script>
import { mapState, mapWritableState } from 'pinia'
import store from '../../Store';
import { Capability } from '../../models/Capability';
import CapabilityRowBreakdownAspect from './CapabilityRowBreakdownAspect.vue';
import Switch from '../Switch.vue';

export default {
    props: {
        capability: {
            type: Capability,
            required: true
        }
    },
    computed: {
        ...mapState(store, ["strings"]),
        ...mapWritableState(store, ["settings_perUnitDisplay"]),
    },
    components: { CapabilityRowBreakdownAspect, Switch },
}
</script>