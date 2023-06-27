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
        ...mapState(store, ['strings', 'capabilities', 'environments', "groupedCapabilities"]),
        groups() {
            return this.groupedCapabilities;
        },
    },

}
</script>