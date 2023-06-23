<template>
    <CapabilityRowDescription :capability="capability"></CapabilityRowDescription>
</template>
<script>
import CapabilityRowDescription from './CapabilityRowDescription.vue';
import { Capability } from '../../models/Capability';
export default {
    props: {
        capability: {
            type: Capability,
            required: true
        }
    },
    components: { CapabilityRowDescription }
}
</script>