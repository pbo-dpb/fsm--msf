<template>
    <div class="flex flex-col justify-center items-center">
        <div v-if="capability.userTargetDiff"
            class="bordered text-white print:text-black font-semibold text-xs px-1 py-.5 rounded-sm" :class="{
                'bg-gray-500': capability.userTargetDiff === 0,
                'bg-red-800': capability.userTargetDiff < 0,
                'bg-green-800': capability.userTargetDiff > 0,
            }">

            <span v-if="capability.userTargetDiff">{{
                userTargetDiff }}
            </span>
        </div>
    </div>
</template>
<script>
import Localizer from '../../Localizer';
import { Capability } from '../../models/Capability';
import { mapState } from 'pinia'
import store from '../../Store';

export default {
    props: {
        capability: {
            type: Capability,
            required: true
        }
    },
    computed: {
        ...mapState(store, ['language']),
        currentTarget() {
            return this.capability.userTargetDiff ? Localizer.formatNumber(this.capability.current, this.language) : Localizer.formatNumber(this.capability.current, this.language, this.capability.current_unit)
        },
        userTargetDiff() {
            return (this.capability.userTargetDiff > 0 ? '+' : '') + Localizer.formatNumber(this.capability.userTargetDiff, this.language, this.capability.current_unit)
        }
    }
}

</script>