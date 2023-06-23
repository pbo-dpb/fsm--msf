<template>
    <section class="flex flex-col gap-4 w-full">
        <CapabilityGroup v-for="group in groups" :group="group" />
    </section>
</template>
<script>
import { mapState } from 'pinia'
import store from '../Store'
import CapabilityGroup from './CapabilityRow/CapabilityGroup.vue';

export default {
    components: {
        CapabilityGroup,
    },
    computed: {
        ...mapState(store, ['strings', 'capabilities', 'environments']),
        groups() {
            if (!this.capabilities || this.capabilities.length === 0) return [];
            let groups = {};
            this.capabilities.forEach((capability) => {
                const key = capability.environment?.id ?? null;
                if (!groups[key]) {
                    groups[key] = [];
                }
                groups[key].push(capability);
                return groups;
            })
            return groups
        },
    },

}
</script>