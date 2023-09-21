<template>
    <div class="flex flex-col gap-2 border-gray-300 dark:border-gray-700 " :class="{
        'border-l-2 pl-2': group,
    }">

        <div class="flex flex-row justify-between items-center">


            <slot></slot>

            <div v-if="facetsOfInterest.length === 1" class="col-span-2 lining-nums inline-flex gap-2">
                <span :class="{ 'line-through decoration-gray-500': shouldDisplayImpactDiff }">{{
                    getValForFacet(facetsOfInterest[0], false)
                }}</span>
                <span v-if="shouldDisplayImpactDiff" class="text-red-800 dark:text-red-200">
                    {{ getValForFacet(facetsOfInterest[0], true) }}
                </span>
            </div>
        </div>

        <dl class="grid grid-cols-3 gap-1" v-if="facetsOfInterest.length > 1">
            <template v-for="(facet, key) in summaryCurrentAspects[aspect]">
                <template v-if="facetsOfInterest.includes(key)">
                    <dt class="font-semibold text-gray-800 dark:text-gray-200 overflow-x-hidden">{{
                        strings[`impact_facet_label_${key}`] }}</dt>
                    <dd class="col-span-2 lining-nums inline-flex gap-2">
                        <span :class="{ 'line-through decoration-gray-500': shouldDisplayImpactDiff }">{{
                            getValForFacet(key, false)
                        }}</span>
                        <span v-if="shouldDisplayImpactDiff" class="text-red-800 dark:text-red-200">
                            {{ getValForFacet(key, true) }}
                        </span>

                    </dd>
                </template>

            </template>
        </dl>
    </div>
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