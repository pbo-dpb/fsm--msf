<template>
    <!--<div>
        <Switch v-model="settings_perUnitDisplay">{{ strings.impact_per_unit_toggle }}</Switch>
    </div>-->

    <figure class="flex flex-col gap-4">

        <div class="flex flex-col gap-1">
            <CapabilityRowBreakdownAspect :capability="capability" aspect="cost">
            </CapabilityRowBreakdownAspect>
            <p class="ml-2 pl-2 py-1 text-gray-700 text-xs border-l-2 border-gray-100">{{
                vars.capabilities_rounding_note_cost[language]
            }}
            </p>
        </div>

        <div class="flex flex-col gap-1">
            <CapabilityRowBreakdownAspect :capability="capability" aspect="personnel"></CapabilityRowBreakdownAspect>
            <p class="ml-2 pl-2 py-1 text-gray-700 text-xs border-l-2 border-gray-100">{{
                vars.capabilities_rounding_note_personnel[language]
            }}
            </p>
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
        ...mapState(store, ["language", "strings", "vars"]),
        ...mapWritableState(store, ["settings_perUnitDisplay"]),
    },
    components: { CapabilityRowBreakdownAspect, Switch },
}
</script>