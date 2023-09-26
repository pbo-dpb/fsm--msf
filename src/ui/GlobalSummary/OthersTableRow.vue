<template>
    <tr :class="{ 'bg-purple-50 dark:bg-purple-950': highlight }">
        <th scope="row" class="font-normal border border-gray-300 dark:border-gray-900 px-1 py-.5"
            :class="{ 'w-1/3': !shouldDisplayImpactDiff, 'w-1/4': shouldDisplayImpactDiff }">
            <slot></slot>
        </th>

        <td v-if="facetsOfInterest.length === 1"
            class="w-1/3 border border-gray-300 dark:border-gray-900 px-1 py-.5 tabular-nums text-center"
            :class="{ 'w-1/3': !shouldDisplayImpactDiff, 'w-1/4': shouldDisplayImpactDiff }">
            <div class="inline-flex gap-1">
                <span>{{
                    formatValue(capabilityVal, false)
                }}</span>

            </div>
        </td>

        <template v-if="shouldDisplayImpactDiff">
            <td class="border border-gray-300 dark:border-gray-900 px-1 py-.5 tabular-nums text-center w-1/4" :class="{
                'bg-blue-50 dark:bg-blue-950': !this.highlight,
                'bg-blue-100 dark:bg-blue-900': this.highlight
            }">
                <span class="sr-only">{{ strings['empty_cell'] }}</span>
            </td>

            <td class="border border-gray-300 dark:border-gray-900 px-1 py-.5 tabular-nums text-center w-1/4" :class="{
                'bg-blue-50 dark:bg-blue-950': !this.highlight,
                'bg-blue-100 dark:bg-blue-900': this.highlight
            }">{{
    formatValue(capabilityVal, true) }}</td>
        </template>



    </tr>
</template>
<script>
import { mapState } from 'pinia'
import store from '../../Store';
import Localizer from '../../Localizer';
export default {
    props: {
        aspect: {
            type: String,
            required: true,
            validator: (value) => {
                return ['personnel', 'cost'].includes(value);
            }
        },
        group: {
            type: Array,
            required: false
        },
        facetsOfInterest: {
            type: Array,
            required: true,
        },
        highlight: {
            type: Boolean,
            default: false
        },
        shouldDisplayImpactDiff: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        ...mapState(store, ['strings', 'language', 'capabilities']),

        capabilityVal() {
            return this.capabilities.find((c) => c.id == "Compliance")[this.aspect].inst_overhead
        }
    },
    methods: {

        formatValue(value) {
            if (this.aspect === 'cost') {
                return new Intl.NumberFormat(`${this.language}-CA`, { style: 'currency', "currency": "CAD", minimumFractionDigits: 2, maximumFractionDigits: 2, notation: 'compact' }).format(value);
            }
            return Localizer.formatNumber(value, this.language);
        },


    }
}
</script>