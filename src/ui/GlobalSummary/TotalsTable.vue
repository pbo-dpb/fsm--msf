<template>
    <table class="border border-gray-300 dark:border-gray-900">
        <tr>
            <th role="cell"></th>
            <th scope="col">{{ strings[`impact_${aspect}_title`] }}</th>
            <template v-if="shouldDisplayImpactDiff">
                <th scope="col">{{ strings.impact_user_diff_title }}</th>
                <th scope="col">{{ strings.impact_user_total_title }}</th>
            </template>
        </tr>
        <TotalsTableRow v-for="group in groupedCapabilities" :group="group" :aspect="aspect"
            :facets-of-interest="facetsOfInterest" :should-display-impact-diff="shouldDisplayImpactDiff">
            {{
                environmentForGroup(group)?.[`display_name_${language}`] }}
        </TotalsTableRow>

        <TotalsTableRow :aspect="aspect" :facets-of-interest="facetsOfInterest" :highlight="true"
            :should-display-impact-diff="shouldDisplayImpactDiff">
            {{
                strings[`impact_facet_label_${facetsOfInterest[0]}`] }}
        </TotalsTableRow>
    </table>
</template>
<script>
import { mapState } from 'pinia'
import store from '../../Store'
import TotalsTableRow from './TotalsTableRow.vue';

export default {
    computed: {
        ...mapState(store, ["strings", "groupedCapabilities", "hasCustomUserTargets", "language", "vars"]),
        shouldDisplayImpactDiff() {

            return Object.values(this.groupedCapabilities).find(g => this.hasCustomUserTargets(g)) ? true : false;
        },
    },
    props: {
        facetsOfInterest: {
            type: Array,
            required: true,
        },
        aspect: {
            type: String,
            required: true,
            validator: (value) => {
                return ['personnel', 'cost'].includes(value);
            }
        },
    },
    components: { TotalsTableRow },
    methods: {
        environmentForGroup(group) {
            return group[0]?.environment ?? null;
        }
    }
}
</script>