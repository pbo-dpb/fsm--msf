<template>
    <div v-if="description"
        class="prose-sm max-w-none prose-p:leading-tight border-t border-gray-300 dark:border-gray-700 pt-2">
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