<template>
    <button
        @click="click"
        :class="classes"
        role="tab"
        :aria-selected="active ? true : null"
        :active="active ? true : null"
        class="ml-2 rounded-sm px-2 py-1 font-semibold whitespace-nowrap last:mr-2 md:first:ml-0">
        <div class="flex flex-row items-center gap-2">
            <slot></slot>
        </div>
    </button>
</template>

<script setup>
    import { computed } from "vue";

    const props = defineProps({
        label: {
            type: String,
        },
        active: {
            type: Boolean,
            default: false,
        },
    });

    const classes = computed(() => {
        let classList = [];
        if (props.active) {
            classList.push(
                "bg-blue-800",
                "dark:bg-blue-200",
                "text-white",
                "dark:text-blue-900",
            );
        } else {
            classList.push(
                "hover:bg-blue-100",
                "dark:hover:bg-blue-700",
                "dark:bg-blue-950",
                "text-blue-800",
                "dark:text-blue-200",
            );
        }
        return classList;
    });
</script>
