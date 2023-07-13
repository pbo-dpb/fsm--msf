<template>
    <div class="flex flex-col justify-start odd:bg-gray-50 odd:dark:bg-gray-900 py-2 gap-2 -mx-2 px-2">
        <button @click="expanded = !expanded"
            class="col-span-6 text-lg font-thin inline-flex gap-2 items-center text-blue-800 dark:text-blue-200 select-none text-left ">

            <ChevronDownIcon class="h-4 w-4 " v-if="expanded"></ChevronDownIcon>
            <ChevronRightIcon class="h-4 w-4" v-else></ChevronRightIcon>
            <div class="inline-flex gap-4 overflow-x-ellipsis w-full">
                {{ displayName }}
                <CapabilityRowTarget :capability="capability" v-if="capability.user_editable"></CapabilityRowTarget>
            </div>
        </button>
        <div class="col-span-4 pl-4">
            <CapabilityRowRange :capability="capability" v-if="capability.user_editable" />
        </div>


        <div class="pl-4 flex flex-col gap-2" v-if="expanded">
            <CapabilityRowDetails :capability="capability"></CapabilityRowDetails>
            <CapabilityRowBreakdown :capability="capability"></CapabilityRowBreakdown>

        </div>
    </div>
</template>
<script>
import { Capability } from '../../models/Capability';
import CapabilityRowRange from './CapabilityRowRange.vue';
import CapabilityRowDetails from './CapabilityRowDetails.vue';
import CapabilityRowBreakdown from './CapabilityRowBreakdown.vue';
import CapabilityRowTarget from './CapabilityRowTarget.vue';
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
        CapabilityRowBreakdown,
        CapabilityRowTarget
    }
}
</script>