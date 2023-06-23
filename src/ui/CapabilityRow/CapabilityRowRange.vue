<template>
    <div class="w-full flex flex-col">
        <input type="range" :min="capability.user_editable.range_min" :max="capability.user_editable.range_max"
            :step="capability" class="w-full" :id="uid" v-model="capability.state.user_target" />

        <div class="flex flex-row justify-between text-sm text-gray-600 dark:text-gray-400" aria-hidden="true">
            <span>{{ capability.user_editable.range_min }}</span>
            <span>{{ capability.current }}</span>
            <span>{{ capability.user_editable.range_max }}</span>
        </div>
    </div>
</template>

<script>
import { v4 as uuidv4 } from 'uuid';
import { Capability } from '../../models/Capability';
import Localizer from "../../Localizer"

export default {
    props: {
        capability: {
            type: Capability,
            required: true
        }
    },
    data() {
        return {
            uid: `crrange-${uuidv4()}`
        }
    },
    computed: {
        ticks() {
            return [
                Localizer.formatNumber(this.capability.user_editable.range_min, this.capability.current_unit),
                Localizer.formatNumber(this.capability.current, this.capability.current_unit),
                Localizer.formatNumber(this.capability.user_editable.range_max, this.capability.current_unit),
            ]
        }
    }
}
</script>
