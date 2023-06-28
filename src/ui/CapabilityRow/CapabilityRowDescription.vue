<template>
    <div v-if="description"
        class="prose-sm dark:prose-invert max-w-none prose-p:leading-tight border border-cyan-300 dark:border-cyan-700 bg-cyan-50 dark:bg-cyan-900 p-2">
        {{ description }}
    </div>
</template>
<script>
import { Capability } from '../../models/Capability';


export default {

    props: {
        capability: {
            type: Capability,
            required: true
        }
    },

    computed: {
        description() {

            if (this.capability.description === undefined) {
                this.capability.getDescription();
                return null;
            }
            if (this.capability.description === false) return null;
            return this.capability.description[document.documentElement.lang];
        }
    }

}
</script>