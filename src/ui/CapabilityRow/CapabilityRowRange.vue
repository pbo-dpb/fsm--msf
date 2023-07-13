<template>
    <div class="w-full flex flex-col">
        <input type="range" :min="capability.user_editable.range_min" :max="capability.user_editable.range_max"
            :step="capability.user_editable.step" class="w-full" :id="uid" v-model="capability.state.user_target" />

        <div class="flex flex-row justify-between text-sm text-gray-600 dark:text-gray-400 select-none" aria-hidden="true">
            <span v-for="tick in ticks">{{ tick }}</span>

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

            if (this.capability.current_unit === 'percent') {
                return [
                    Localizer.formatNumber(-this.capability.user_editable.range, this.capability.current_unit),
                    Localizer.formatNumber(this.capability.current, this.capability.current_unit),
                    `+${Localizer.formatNumber(this.capability.user_editable.range, this.capability.current_unit)}`,
                ]
            }

            return [
                Localizer.formatNumber(this.capability.user_editable.range_min, this.capability.current_unit),
                Localizer.formatNumber(this.capability.current, this.capability.current_unit),
                Localizer.formatNumber(this.capability.user_editable.range_max, this.capability.current_unit),
            ]
        }
    }
}
</script>
