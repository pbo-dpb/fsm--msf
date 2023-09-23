<template>
    <div v-if="description" class="prose-sm dark:prose-invert max-w-none prose-p:leading-tight ">
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