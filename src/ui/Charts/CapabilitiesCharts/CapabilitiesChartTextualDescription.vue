<template>
    <details class="print:hidden flex flex-col gap-2 border-l-2 border-blue-200 dark:border-blue-700 pl-2">
        <summary
            class="cursor-pointer text-blue-900 hover:text-blue-800 dark:text-blue-100 dark:hover:text-blue-200 text-sm font-semibold  select-none">
            {{ strings.chart_alt_text_label }}</summary>
        <div>
            <div class="overflow-x-auto prose dark:prose-invert max-w-none">

                <table class="table">

                    <tr>
                        <th scope="column">{{ strings.capability_label }}</th>
                        <th scope="column" v-for="header in capabilitiesColumnHeaders">{{ header }}</th>
                    </tr>

                    <tr v-for="(label, index) in environmentCapabilitiesChartData.labels"
                        class="even:bg-gray-50 dark:even:bg-gray-950">

                        <th scope="row">{{ label }}</th>

                        <td v-for="dataset in environmentCapabilitiesChartData.datasets" class="lining-nums tabular-nums">{{
                            new
                                Intl.NumberFormat(language).format(dataset.data[index])
                        }}</td>

                    </tr>

                </table>




            </div>

            <dl class="mt-2 pt-2 border-t-2 border-gray-300 dark:border-gray-700">
                <template v-for="(v, k) in overheadKvPairs">
                    <dt class="font-semibold">{{ k }}</dt>
                    <dd class="inline-flex items-center gap-1">
                        <ArrowRightIcon aria-hidden="true" class="h-4 w-4"></ArrowRightIcon> {{ v }}
                    </dd>

                </template>

            </dl>
        </div>
    </details>
</template>
<script>
import { ArrowRightIcon } from '@heroicons/vue/24/solid';
import store from '../../../Store';
import { mapState } from 'pinia'

export default {
    props: {
        environmentCapabilitiesChartData: {
            type: Object,
            required: true
        },
        environmentOverheadChartData: {
            type: Object,
            required: true
        },
    },
    computed: {
        ...mapState(store, ["strings", "language"]),
        capabilitiesColumnHeaders() {
            return [
                ...this.environmentCapabilitiesChartData.datasets.map((dataset) => dataset.label),
            ];
        },
        overheadKvPairs() {
            let kvs = {};
            this.environmentOverheadChartData.datasets.forEach(dataset => {
                kvs[dataset.label] = new Intl.NumberFormat(this.language).format(dataset.data[0]);
            });
            return kvs;
        }
    },
    components: { ArrowRightIcon }
}

</script>