<template>
    <div class="flex flex-col gap-4 " v-if="environment">

        <h2 v-if="environment" class="text-2xl font-thin">{{ environment?.[`display_name_${language}`] }}</h2>
        <section class="flex flex-col gap-1 w-full">
            <CapabilityRow v-for="capability in capabilities" :key="capability.id" :capability="capability" />
        </section>

    </div>
</template>
<script>
import CapabilityRow from "./CapabilityRow.vue";
import store from "../../Store"
import { mapState } from 'pinia'

export default {
    components: {
        CapabilityRow,
    },
    props: {
        group: {
            type: Array,
            required: true
        }
    },
    computed: {
        ...mapState(store, ['language']),
        environment() {
            return this.group[0]?.environment ?? null;
        },
        capabilities() {
            return this.group.sort((a, b) => a[`display_name_${this.language}`].localeCompare(b[`display_name_${this.language}`]));
        }
    }
}
</script>