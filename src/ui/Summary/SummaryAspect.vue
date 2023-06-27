<template>
    <div class="flex flex-col gap-2">

        <h4 class="font-thin">{{ strings[`impact_${aspect}_title`] }}</h4>

        <dl class="grid grid-cols-3 gap-1">
            <template v-for="(facet, key) in currentAspects[aspect]">
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
        }
    },
    computed: {
        ...mapState(store, ['strings', 'currentAspects', 'hasCustomUserTargets', 'userTargets']),

        shouldDisplayImpactDiff() {
            return this.hasCustomUserTargets;
        }
    },
    methods: {
        formatValue(value) {
            if (this.aspect === 'cost') {
                return Localizer.formatNumber(value, 'currency');
            }
            return Localizer.formatNumber(value);
        },
        getValForFacet(facet, userTarget = false) {
            return this.formatValue(userTarget ? this.userTargets[this.aspect][facet] :
                this.currentAspects[this.aspect][facet])
        }
    }
}
</script>