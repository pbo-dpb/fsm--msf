<template>
    <details class="print:hidden flex flex-col gap-2 border-l-2 border-blue-200 dark:border-blue-700 pl-2">
        <summary
            class="cursor-pointer text-blue-900 hover:text-blue-800 dark:text-blue-100 dark:hover:text-blue-200 text-sm font-semibold  select-none">
            {{ strings.chart_alt_text_label }}</summary>
        <div>
            <div class="overflow-x-auto prose dark:prose-invert max-w-none">

                <table class="table">

                    <tr>
                        <th role="cell" class="w-1/4"></th>
                        <th scope="column" v-for="dataset in data.datasets" class="w-1/4">{{ dataset.label }}</th>
                    </tr>

                    <tr v-for="(label, index) in data.labels" class="even:bg-gray-50 dark:even:bg-gray-950">

                        <th scope="row">{{ label }}</th>

                        <td v-for="dataset in data.datasets" class="lining-nums tabular-nums">
                            <span v-if="formatValue(dataset.data[index])">
                                {{ formatValue(
                                    dataset.data[index])
                                }}</span>
                            <span v-else class="sr-only">{{ strings.empty_cell }}</span>
                        </td>

                    </tr>

                </table>


            </div>
        </div>
    </details>
</template>
<script>
import store from '../../../Store';
import { mapState } from 'pinia'
import Localizer from '../../../Localizer';

export default {
    props: {
        data: {
            type: Object,
            required: true
        },
    },
    computed: {
        ...mapState(store, ["strings", "language"]),

        columnHeaders() {
            return this.data.datasets.map((dataset) => dataset.label);
        }
    },
    methods: {
        formatValue(value) {
            if (!value || isNaN(value)) return null;

            return Localizer.formatNumber(value, this.language, 'currency')
        }
    }
}

</script>