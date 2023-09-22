<template>
    <div class="flex flex-row">
        <AspectSelectorTabsButton @click="settings_selectedAspect = 'cost'" :active="settings_selectedAspect === 'cost'">{{
            strings.tab_cost_title }}
        </AspectSelectorTabsButton>
        <AspectSelectorTabsButton @click="settings_selectedAspect = 'personnel'"
            :active="settings_selectedAspect === 'personnel'">{{
                strings.tab_personnel_title }}
        </AspectSelectorTabsButton>
    </div>
</template>


<script>
import { mapState, mapWritableState } from 'pinia'
import store from '../../Store';
import AspectSelectorTabsButton from './AspectSelectorTabsButton.vue';

export default {
    components: { AspectSelectorTabsButton },
    computed: {
        ...mapState(store, ["strings"]),
        ...mapWritableState(store, ["settings_selectedAspect"]),
    },

}
</script>