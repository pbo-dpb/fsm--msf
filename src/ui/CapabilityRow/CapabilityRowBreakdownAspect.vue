<template>
    <div class="flex flex-col gap-2">

        <h4 class="font-semibold">{{ strings[`impact_${aspect}_title`] }}</h4>

        <dl class="grid grid-cols-2 gap-1 text-sm pl-4">
            <template v-for="(facet, key) in capability[aspect]">
                <template v-if="['direct', 'indirect'].includes(key)">
                    <dt class="font-semibold text-gray-800 dark:text-gray-200">{{ strings[`impact_facet_label_${key}`] }}
                    </dt>
                    <dd class="lining-nums inline-flex gap-2">
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
import { Capability } from '../../models/Capability';
import Localizer from '../../Localizer';
export default {
    props: {
        capability: {
            type: Capability,
            required: true
        },
        aspect: {
            type: String,
            required: true,
            validator: (value) => {
                return ['personnel', 'cost'].includes(value);
            }
        }
    },
    computed: {
        ...mapState(store, ['strings', 'settings_perUnitDisplay', 'language']),

        shouldDisplayImpactDiff() {
            return this.capability.hasUserTarget && !this.settings_perUnitDisplay;
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
            if (this.settings_perUnitDisplay) {
                return this.formatValue(this.capability.impactPerUnit[this.aspect][facet])
            }
            return this.formatValue(userTarget ? this.capability.userTargetImpact[this.aspect][facet] :
                this.capability[this.aspect][facet])
        }
    }
}
</script>