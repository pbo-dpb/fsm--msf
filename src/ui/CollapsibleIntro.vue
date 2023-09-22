<template>
    <div class="border border-purple-100 rounded dark:border-purple-900 shadow">
        <h3 class="p-4 border-b border-purple-100 flex flex-col">

            <button :id="uid + '-header'" :aria-controls="uid = '-panel'" :aria-expanded="!shouldCollapse" @click="toggle"
                class=" flex flex-row gap-2 items-center text-blue-800 dark:text-blue-200 font-semibold">
                <ChevronRightIcon class="w-6 h-6" v-if="shouldCollapse"></ChevronRightIcon>
                <ChevronDownIcon class="w-6 h-6" v-else></ChevronDownIcon>
                {{ strings.intro_toggle }}
            </button>
        </h3>
        <section :id="uid + '-panel'" :aria-labelledby="uid + '-header'" :hidden="shouldCollapse"
            class="p-5 pb-0 prose dark:prose-invert max-w-none prose-headings:mt-0 prose-headings:font-light">
            <div v-if="introContent" v-html="introContent"></div>
            <LoadingIndicator class="w-6 h-6 mb-5" v-else></LoadingIndicator>
        </section>
    </div>
</template>
<script>
import { ChevronDownIcon, ChevronRightIcon } from '@heroicons/vue/24/solid';
import introEn from '../assets/intro.en.md?url'
import introFr from '../assets/intro.fr.md?url'
import { v4 as uuidv4 } from 'uuid';
import { mapState } from 'pinia'
import store from '../Store'
import LoadingIndicator from './LoadingIndicator.vue';
import { marked } from 'marked';

export default {
    data() {
        return {
            shouldCollapse: false,
            uid: `cintro-${uuidv4()}`,
            localStorageKey: "fsm--msf.collapse-intro",
            fetching: false,
            content: {
                en: null,
                fr: null
            }
        };
    },
    created() {
        try {
            const userPreference = window.localStorage.getItem(this.localStorageKey);
            if (userPreference)
                this.shouldCollapse = true;
        }
        catch (error) {
            // Fail silently
        }
    },
    computed: {
        ...mapState(store, ["language", "strings"]),

        introContent() {

            if (this.content[this.language])
                return marked.parse(this.content[this.language])
            else if (this.fetching !== this.language)
                this.fetchContent(this.language);
            return null;
        }
    },
    methods: {
        async fetchContent(language) {
            this.fetching = language;
            const response = await fetch(language === 'en' ? introEn : introFr);
            const markdown = await response.text();
            this.content[language] = markdown;
            this.fetching = null;
        },
        toggle() {
            this.shouldCollapse = !this.shouldCollapse;
            try {
                if (this.shouldCollapse)
                    window.localStorage.setItem(this.localStorageKey, "TRUE");
                else
                    window.localStorage.removeItem(this.localStorageKey);
            }
            catch (error) {
                // Fail silently
            }
        }
    },
    components: { ChevronRightIcon, ChevronDownIcon, LoadingIndicator }
}

</script>