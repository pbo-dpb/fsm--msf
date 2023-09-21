<template>
    <table class="border border-gray-300 dark:border-gray-900">

        <SummaryAspect v-for="group in groupedCapabilities" :group="group" :aspect="settings_selectedAspect"
            :facets-of-interest="facetsOfInterest">
            {{
                environmentForGroup(group)?.[`display_name_${language}`] }}
        </SummaryAspect>

        <SummaryAspect :aspect="settings_selectedAspect" :facets-of-interest="facetsOfInterest" :highlight="true">
            {{
                strings[`impact_facet_label_${facetsOfInterest[0]}`] }}
        </SummaryAspect>
    </table>
</template>
<script>
import { mapState } from 'pinia'
import store from '../../Store'
import SummaryAspect from './SummaryAspect.vue';

export default {
    computed: {
        ...mapState(store, ["strings", "groupedCapabilities", "language", "vars", "settings_selectedAspect"]),
    },
    props: {
        facetsOfInterest: {
            type: Array,
            required: true,
        }
    },
    components: { SummaryAspect },
    methods: {
        environmentForGroup(group) {
            return group[0]?.environment ?? null;
        }
    }
}
</script>