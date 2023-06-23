<template>
    <div class="flex flex-col lg:grid grid-cols-12 justify-between odd:bg-gray-50 odd:dark:bg-gray-900 py-2 -mx-2 px-2">
        <div class="col-span-4 text-lg font-thin">
            {{ displayName }}
        </div>
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
        displayName() {

            return this.capability[`display_name_${document.documentElement.lang}`];
        }
    }
}
</script>