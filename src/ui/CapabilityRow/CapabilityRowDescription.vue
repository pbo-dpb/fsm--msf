<template>
    <div v-if="description"
        class="prose-sm dark:prose-invert max-w-none prose-p:leading-tight border border-cyan-300 dark:border-cyan-700 bg-cyan-50 dark:bg-cyan-900 p-2">
        {{ description }}
    </div>
</template>
<script>
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

    computed: {
        ...mapState(store, ['language']),
        description() {
            return this.capability.description?.[this.language] ?? null;
        }
    }

}
</script>