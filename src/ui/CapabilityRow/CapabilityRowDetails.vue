<template>
    <CapabilityRowDescription :capability="capability"></CapabilityRowDescription>


    <div v-if="capability[`specific_note_${language}`]"
        class="prose prose-sm font-semibold bg-yellow-50 border border-yellow-300 dark:bg-yellow-950 dark:border-yellow-700 rounded p-2">
        <p>* {{
            capability[`specific_note_${language}`] }}</p>
    </div>
</template>
<script>
import CapabilityRowDescription from './CapabilityRowDescription.vue';
import { Capability } from '../../models/Capability';
import store from "../../Store"
import { mapState } from 'pinia'
export default {
    props: {
        capability: {
            type: Capability,
            required: true
        }
    },
    components: { CapabilityRowDescription },
    computed: {
        ...mapState(store, ['language']),

    },
}
</script>