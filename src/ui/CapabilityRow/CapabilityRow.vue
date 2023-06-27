<template>
    <div
        class="flex flex-col lg:grid grid-cols-3 justify-between odd:bg-gray-50 odd:dark:bg-gray-900 py-2 -mx-2 px-2 items-center">
        <button @click="expanded = !expanded"
            class="col-span-2 text-lg font-thin inline-flex gap-2 items-center text-blue-800 select-none">

            <ChevronDownIcon class="h-4 w-4 " v-if="expanded"></ChevronDownIcon>
            <ChevronRightIcon class="h-4 w-4" v-else></ChevronRightIcon>
            {{ displayName }}
        </button>
        <CapabilityRowRange v-if="capability.user_editable" :capability="capability" />
    </div>
    <div class="pl-4 flex flex-col gap-2" v-if="expanded">
        <CapabilityRowBreakdown :capability="capability"></CapabilityRowBreakdown>
        <CapabilityRowDetails :capability="capability"></CapabilityRowDetails>
    </div>
</template>
<script>
import { Capability } from '../../models/Capability';
import CapabilityRowRange from './CapabilityRowRange.vue';
import CapabilityRowDetails from './CapabilityRowDetails.vue';
import CapabilityRowBreakdown from './CapabilityRowBreakdown.vue';
import { ChevronRightIcon, ChevronDownIcon } from '@heroicons/vue/24/solid'

export default {
    data() {
        return {
            expanded: false
        }
    },
    props: {
        capability: {
            type: Capability,
            required: true
        }
    },
    computed: {
        displayName() {
            return this.capability[`display_name_${document.documentElement.lang}`];
        }
    },
    components: {
        CapabilityRowRange,
        ChevronRightIcon,
        ChevronDownIcon,
        CapabilityRowDetails,
        CapabilityRowBreakdown
    }
}
</script>