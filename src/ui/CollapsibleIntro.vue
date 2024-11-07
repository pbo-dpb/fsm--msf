<template>
  <div class="border border-purple-100 rounded dark:border-purple-900 shadow">
    <h3 class="p-4 border-b border-purple-100 flex flex-col">
      <button
        :id="uid + '-header'"
        :aria-controls="(uid = '-panel')"
        :aria-expanded="!shouldCollapse"
        @click="toggle"
        class="flex flex-row gap-2 items-center text-blue-800 dark:text-blue-200 font-semibold"
      >
        <ChevronRightIcon
          class="w-6 h-6"
          v-if="shouldCollapse"
        ></ChevronRightIcon>
        <ChevronDownIcon class="w-6 h-6" v-else></ChevronDownIcon>
        {{ strings.intro_toggle }}
      </button>
    </h3>
    <section
      :id="uid + '-panel'"
      :aria-labelledby="uid + '-header'"
      :hidden="shouldCollapse"
      class="p-5 pb-0 prose dark:prose-invert max-w-none prose-headings:mt-0 prose-headings:font-light prose-a:text-blue-800 prose-a:dark:text-blue-200"
    >
      <div v-if="introContent" v-html="introContent"></div>
      <LoadingIndicator class="w-6 h-6 mb-5" v-else></LoadingIndicator>
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