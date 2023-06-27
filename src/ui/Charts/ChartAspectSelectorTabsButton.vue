<template>
    <button @click="click" :class="classes" role="tab" :aria-selected="active ? true : null" :active="active ? true : null"
        class="
            px-2
            py-1
            md:first:ml-0
            ml-2
            last:mr-2
            rounded
            font-semibold
            whitespace-nowrap
          ">
        <div class="flex flex-row gap-2 items-center">
            <slot></slot>
        </div>
    </button>
</template>
  
<script>
export default {
    props: {
        label: {
            type: String,
        },
        active: {
            type: Boolean,
            default: false,
        },
    },

    computed: {
        classes() {
            let classes = [];
            if (this.active) {
                classes.push("bg-blue-800");
                classes.push("dark:bg-blue-200");
                classes.push("text-white");
                classes.push("dark:text-blue-900");
            } else {
                classes.push("hover:bg-blue-100");
                classes.push("hover:dark:bg-blue-700");
                classes.push("dark:bg-blue-950");
                classes.push("text-blue-800");
                classes.push("dark:text-blue-200");
            }
            return classes;
        },
    },
};
</script>