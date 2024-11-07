<template>
  <button
    @click="click"
    :class="classes"
    role="tab"
    :aria-selected="active ? true : null"
    :active="active ? true : null"
    class="px-2 py-1 md:first:ml-0 ml-2 last:mr-2 rounded font-semibold whitespace-nowrap"
  >
    <div class="flex flex-row gap-2 items-center">
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
      "dark:text-blue-900"
    );
  } else {
    classList.push(
      "hover:bg-blue-100",
      "hover:dark:bg-blue-700",
      "dark:bg-blue-950",
      "text-blue-800",
      "dark:text-blue-200"
    );
  }
  return classList;
});
</script>
