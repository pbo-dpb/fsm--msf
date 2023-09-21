<template>
    <tr :class="{ 'bg-purple-100 dark:bg-purple-900': highlight }">
        <th scope="row" class="w-1/2 border border-gray-300 dark:border-gray-900 px-1 py-.5">
            <slot></slot>
        </th>

        <td v-if="facetsOfInterest.length === 1"
            class="w-1/2 border border-gray-300 dark:border-gray-900 px-1 py-.5 tabular-nums">
            <div class="inline-flex gap-1">
                <span :class="{ 'line-through decoration-gray-500': shouldDisplayImpactDiff }">{{
                    getValForFacet(facetsOfInterest[0], false)
                }}</span>
                <span v-if="shouldDisplayImpactDiff" class="text-red-800 dark:text-red-200">
                    {{ getValForFacet(facetsOfInterest[0], true) }}
                </span>
            </div>
        </td>

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
        }
    },
    computed: {
        ...mapState(store, ['strings', 'currentAspects', 'hasCustomUserTargets', 'userTargets', 'language']),

        shouldDisplayImpactDiff() {
            return this.hasCustomUserTargets(this.group);
        },

        summaryCurrentAspects() {
            return this.currentAspects(this.group);
        },

        summaryUserTargets() {
            return this.userTargets(this.group);
        }
    },
    methods: {
        formatValue(value) {
            if (this.aspect === 'cost') {
                return Localizer.formatNumber(value, this.language, 'currency');
            }
            return Localizer.formatNumber(value, this.language);
        },
        getValForFacet(facet, userTarget = false) {
            return this.formatValue(userTarget ? this.summaryUserTargets[this.aspect][facet] :
                this.summaryCurrentAspects[this.aspect][facet])
        }
    }
}
</script>