<template>
    <div
        class="-mx-2 flex flex-col justify-start gap-2 px-2 py-2 odd:bg-gray-50 dark:odd:bg-gray-900"
        ref="rowRef">
        <button
            @click="expanded = !expanded"
            class="col-span-6 inline-flex items-center gap-2 text-left text-lg font-thin text-blue-800 select-none dark:text-blue-200">
            <ChevronDownIcon
                class="h-4 w-4"
                v-if="expanded"></ChevronDownIcon>
            <ChevronRightIcon
                class="h-4 w-4"
                v-else></ChevronRightIcon>
            <div
                class="overflow-x-ellipsis inline-flex w-full items-center gap-4">
                <span
                    >{{ displayName
                    }}<span
                        class="font-semibold"
                        v-if="capability[`specific_note_${language}`]"
                        >*</span
                    ></span
                >
                <CapabilityRowTarget
                    :capability="capability"
                    v-if="capability.user_editable"></CapabilityRowTarget>
            </div>

            <span
                class="__tooltip hidden text-gray-500 md:block"
                :id="`tip-${uid}`"
                :aria-describedby="`${uid}-tippy`">
                <QuestionMarkCircleIcon
                    v-if="false && capability.user_editable"
                    class="h-4 w-4"></QuestionMarkCircleIcon>
                <LockClosedIcon
                    v-if="!capability.user_editable"
                    class="h-4 w-4"></LockClosedIcon>
            </span>
            <span
                :id="`${uid}-tippy`"
                class="sr-only"
                data-tippy-root
                v-if="false">
                {{ strings.unlocked_capability || strings.locked_capability }}
            </span>
        </button>
        <div class="col-span-4 pl-4">
            <CapabilityRowRange
                :capability="capability"
                v-if="capability.user_editable" />
        </div>

        <div
            class="my-2 flex flex-col gap-2 border-l-2 border-solid border-gray-300 pl-4 dark:border-gray-700"
            v-if="expanded">
            <CapabilityRowDetails
                :capability="capability"></CapabilityRowDetails>
            <CapabilityRowBreakdown
                :capability="capability"></CapabilityRowBreakdown>
        </div>
    </div>
</template>

<script setup>
    import { ref, computed, onMounted, nextTick } from "vue";
    import { storeToRefs } from "pinia";
    import { Capability } from "../../models/Capability";
    import { useLanguageStore } from "../../stores/languageStore";
    import CapabilityRowRange from "./CapabilityRowRange.vue";
    import CapabilityRowDetails from "./CapabilityRowDetails.vue";
    import CapabilityRowBreakdown from "./CapabilityRowBreakdown.vue";
    import CapabilityRowTarget from "./CapabilityRowTarget.vue";
    import tippy from "tippy.js";
    import "tippy.js/dist/tippy.css";
    import {
        ChevronRightIcon,
        ChevronDownIcon,
        LockClosedIcon,
        QuestionMarkCircleIcon,
    } from "@heroicons/vue/24/solid";
    import { v4 as uuidv4 } from "uuid";

    const props = defineProps({
        capability: {
            type: Capability,
            required: true,
        },
    });

    const languageStore = useLanguageStore();
    const { language, strings } = storeToRefs(languageStore);

    const expanded = ref(false);
    const uid = ref(`crrange-${uuidv4()}`);
    const rowRef = ref(null); // Add template ref

    const displayName = computed(
        () => props.capability[`display_name_${language.value}`],
    );

    const parseTooltips = () => {
        nextTick(() => {
            if (rowRef.value) {
                // Check if ref exists
                rowRef.value
                    .querySelectorAll(".__tooltip")
                    .forEach((tooltipEl) => {
                        const describedByEl = rowRef.value.querySelector(
                            `#${tooltipEl.getAttribute("aria-describedby")}`,
                        );
                        if (describedByEl) {
                            tippy(tooltipEl, {
                                content: describedByEl.innerText,
                            });
                        }
                    });
            }
        });
    };

    onMounted(() => {
        parseTooltips();
    });
</script>
