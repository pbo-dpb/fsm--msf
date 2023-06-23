<template>
    <div class="flex flex-col gap-4 ">

        <h2 v-if="environment" class="text-2xl font-thin">{{ environment?.display_name_en }}</h2>
        <section class="flex flex-col gap-1 w-full">
            <CapabilityRow v-for="capability in capabilities" :key="capability.id" :capability="capability" />
        </section>

    </div>
</template>
<script>
import CapabilityRow from "./CapabilityRow.vue";
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
        environment() {
            return this.group[0]?.environment ?? null;
        },
        capabilities() {
            return this.group.sort((a, b) => a[`display_name_${document.documentElement.lang}`].localeCompare(b[`display_name_${document.documentElement.lang}`]));
        }
    }
}
</script>