<template>
    <div class="flex flex-col justify-start odd:bg-gray-50 odd:dark:bg-gray-900 py-2 gap-2 -mx-2 px-2" ref="row">
        <button @click="expanded = !expanded"
            class="col-span-6 text-lg font-thin inline-flex gap-2 items-center text-blue-800 dark:text-blue-200 select-none text-left ">

            <ChevronDownIcon class="h-4 w-4 " v-if="expanded"></ChevronDownIcon>
            <ChevronRightIcon class="h-4 w-4" v-else></ChevronRightIcon>
            <div class="inline-flex gap-4 overflow-x-ellipsis w-full items-center">
                <span>{{ displayName }}<span class="font-semibold"
                        v-if="capability[`specific_note_${language}`]">*</span></span>
                <CapabilityRowTarget :capability="capability" v-if="capability.user_editable"></CapabilityRowTarget>
            </div>

            <span class="__tooltip hidden md:block text-gray-500" :id="`tip-${uid}`" :aria-describedby="`${uid}-tippy`">
                <QuestionMarkCircleIcon v-if="false && capability.user_editable" class=" w-4 h-4"></QuestionMarkCircleIcon>
                <LockClosedIcon v-if="!capability.user_editable" class=" w-4 h-4"></LockClosedIcon>
            </span>
            <span :id="`${uid}-tippy`" class="sr-only" data-tippy-root v-if="false">
                {{ capability.user_editable ? strings.unlocked_capability : strings.locked_capability }}
            </span>
        </button>
        <div class="col-span-4 pl-4">
            <CapabilityRowRange :capability="capability" v-if="capability.user_editable" />
        </div>


        <div class="pl-4 flex flex-col gap-2 border-l-2 border-gray-300 dark:border-gray-700 ml-4 my-2" v-if="expanded">
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
import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';
import { ChevronRightIcon, ChevronDownIcon, LockClosedIcon, QuestionMarkCircleIcon } from '@heroicons/vue/24/solid'
import store from "../../Store"
import { mapState } from 'pinia'
import { v4 as uuidv4 } from 'uuid';


export default {
    data() {
        return {
            expanded: false,
            uid: `crrange-${uuidv4()}`
        }
    },
    props: {
        capability: {
            type: Capability,
            required: true
        }
    },
    computed: {
        ...mapState(store, ['language', 'strings']),
        displayName() {
            return this.capability[`display_name_${this.language}`];
        }
    },
    components: {
        CapabilityRowRange,
        ChevronRightIcon,
        ChevronDownIcon,
        CapabilityRowDetails,
        CapabilityRowBreakdown,
        CapabilityRowTarget,
        LockClosedIcon,
        QuestionMarkCircleIcon
    },
    mounted() {
        this.parseTooltips();

    },
    methods: {
        parseTooltips() {
            this.$nextTick(() => {
                this.$refs.row.querySelectorAll('.__tooltip').forEach((tooltipEl) => {
                    let describedByEl = this.$refs.row.querySelector(`#${tooltipEl.getAttribute("aria-describedby")}`);
                    if (!describedByEl) return;
                    tippy(tooltipEl, {
                        content: describedByEl.innerText,
                    });

                })
            })
        }
    },
}
</script>