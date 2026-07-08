<template>
    <div
        class="rounded-sm border border-solid border-purple-100 shadow-sm dark:border-purple-900">
        <h3 class="flex flex-col border-b border-solid border-purple-100 p-4">
            <button
                :id="uid + '-header'"
                :aria-controls="uid = '-panel'"
                :aria-expanded="!shouldCollapse"
                @click="toggle"
                class="flex flex-row items-center gap-2 font-semibold text-blue-800 dark:text-blue-200">
                <ChevronRightIcon
                    class="h-6 w-6"
                    v-if="shouldCollapse"></ChevronRightIcon>
                <ChevronDownIcon
                    class="h-6 w-6"
                    v-else></ChevronDownIcon>
                {{ strings.intro_toggle }}
            </button>
        </h3>
        <section
            :id="uid + '-panel'"
            :aria-labelledby="uid + '-header'"
            :hidden="shouldCollapse"
            class="prose dark:prose-invert prose-headings:mt-0 prose-headings:font-light prose-a:text-blue-800 dark:prose-a:text-blue-200 max-w-none p-5 pb-0">
            <div
                v-if="introContent"
                v-html="introContent"></div>
            <LoadingIndicator
                class="mb-5 h-6 w-6"
                v-else></LoadingIndicator>
        </section>
    </div>
</template>

<script setup>
    import { ref, computed, onMounted } from "vue";
    import { storeToRefs } from "pinia";
    import { ChevronDownIcon, ChevronRightIcon } from "@heroicons/vue/24/solid";
    import { v4 as uuidv4 } from "uuid";
    import { marked } from "marked";
    import { useLanguageStore } from "../stores/languageStore";
    import LoadingIndicator from "./LoadingIndicator.vue";
    import introEn from "../assets/intro.en.md?url";
    import introFr from "../assets/intro.fr.md?url";

    // Use language store instead of combined store
    const languageStore = useLanguageStore();
    const { language, strings } = storeToRefs(languageStore);

    const shouldCollapse = ref(false);
    const uid = ref(`cintro-${uuidv4()}`);
    const localStorageKey = "fsm--msf.collapse-intro";
    const fetching = ref(null);
    const content = ref({
        en: null,
        fr: null,
    });

    onMounted(() => {
        try {
            const userPreference = window.localStorage.getItem(localStorageKey);
            if (userPreference) shouldCollapse.value = true;
        } catch (error) {
            // Fail silently
        }
    });

    const introContent = computed(() => {
        if (content.value[language.value]) {
            return marked.parse(content.value[language.value]);
        } else if (fetching.value !== language.value) {
            fetchContent(language.value);
        }
        return null;
    });

    const fetchContent = async (lang) => {
        fetching.value = lang;
        const response = await fetch(lang === "en" ? introEn : introFr);
        const markdown = await response.text();
        content.value[lang] = markdown;
        fetching.value = null;
    };

    const toggle = () => {
        shouldCollapse.value = !shouldCollapse.value;
        try {
            if (shouldCollapse.value) {
                window.localStorage.setItem(localStorageKey, "TRUE");
            } else {
                window.localStorage.removeItem(localStorageKey);
            }
        } catch (error) {
            // Fail silently
        }
    };
</script>
