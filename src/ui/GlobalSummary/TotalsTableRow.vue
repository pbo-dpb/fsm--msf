<template>
    <tr :class="{ 'bg-purple-50 dark:bg-purple-950': highlight }">
        <th scope="row" class=" border border-gray-300 dark:border-gray-900 px-1 py-.5"
            :class="{ 'w-1/3': !shouldDisplayImpactDiff, 'w-1/4': shouldDisplayImpactDiff }">
            <slot></slot>
        </th>

        <td v-if="facetsOfInterest.length === 1"
            class="w-1/3 border border-gray-300 dark:border-gray-900 px-1 py-.5 tabular-nums text-center"
            :class="{ 'w-1/3': !shouldDisplayImpactDiff, 'w-1/4': shouldDisplayImpactDiff }">
            <div class="inline-flex gap-1">
                <span :class="{ 'line-through decoration-gray-500': getDiffForFacet(facetsOfInterest[0]) != 0 }">{{
                    getValForFacet(facetsOfInterest[0], false)
                }}</span>

            </div>
        </td>

        <template v-if="shouldDisplayImpactDiff">
            <td class="border border-gray-300 dark:border-gray-900 px-1 py-.5 tabular-nums text-center w-1/4" :class="{
                'bg-blue-50 dark:bg-blue-950': !this.highlight,
                'bg-blue-100 dark:bg-blue-900': this.highlight
            }">
                <span v-if="getDiffForFacet(facetsOfInterest[0]) != 0">{{ getFormattedDiffForFacet(facetsOfInterest[0])
                }}</span>
            </td>

            <td class="border border-gray-300 dark:border-gray-900 px-1 py-.5 tabular-nums text-center w-1/4" :class="{
                    'bg-blue-50 dark:bg-blue-950': !this.highlight,
                    'bg-blue-100 dark:bg-blue-900': this.highlight
                }">{{
        getValForFacet(facetsOfInterest[0], true) }}</td>
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
        ...mapState(store, ['strings', 'currentAspects', 'hasCustomUserTargets', 'userTargets', 'language']),

        summaryCurrentAspects() {
            return this.currentAspects(this.group);
        },

        summaryUserTargets() {
            return this.userTargets(this.group);
        }
    },
    methods: {

        formatValue(value, digits = 2) {
            if (this.aspect === 'cost') {
                return new Intl.NumberFormat(`${this.language}-CA`, { style: 'currency', "currency": "CAD", minimumFractionDigits: digits, maximumFractionDigits: digits, notation: 'compact' }).format(value);
            }
            return Localizer.formatNumber(value, this.language);
        },
        getDiffForFacet(facet) {
            return this.summaryUserTargets[this.aspect][facet] - this.summaryCurrentAspects[this.aspect][facet];
        },
        getFormattedDiffForFacet(facet) {
            const rawDiff = this.getDiffForFacet(facet)
            return `${rawDiff > 0 ? '+' : '-'} ${this.formatValue(rawDiff, 0)}`
        },
        getValForFacet(facet, userTarget = false) {
            return this.formatValue(userTarget ? this.summaryUserTargets[this.aspect][facet] :
                this.summaryCurrentAspects[this.aspect][facet])
        }
    }
}
</script>