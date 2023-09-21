<template>
    <div role="img" :aria-labelledby="`${uid}-description`" class="h-[48rem] w-full">
        <Bar v-if="datasets" :options="chartOptions" :data="chartData" />
    </div>
    <AspectChartTextualDescription :data="chartData" :id="`${uid}-description`"></AspectChartTextualDescription>

    <p class="border-l-2 border-gray-200 dark:border-gray-700 dark:border-blue-700 pl-2 text-gray-700 text-sm">{{
        vars[`capabilities_rounding_note_${aspect}`][language]
    }}
    </p>
</template>
  
<script>
import AspectChartTextualDescription from './AspectChartTextualDescription.vue';
import { mapState } from 'pinia'
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'
import { colorForIndex } from "../ColorPalettes";
import store from '../../../Store';
import { v4 as uuidv4 } from 'uuid';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

export default {
    props: {
        aspect: {
            type: String,
            required: true,
            validator: (value) => {
                return ['personnel', 'cost'].includes(value);
            }
        },

    },
    data() {
        return {
            uid: `aspectchart-${uuidv4()}`
        }
    },
    components: { Bar, AspectChartTextualDescription },
    computed: {
        ...mapState(store, ["strings", 'capabilities', 'groupedCapabilities', 'language', 'vars']),



        chartOptions() {
            return {
                maintainAspectRatio: false,
                indexAxis: 'y',
                plugins: {
                    legend: {
                        position: "bottom"
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                return new Intl.NumberFormat(`${this.language}-CA`).format(context.parsed.x)
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        stacked: true,
                        ticks: {
                            callback: function (value, index, ticks) {
                                const formatter = Intl.NumberFormat(this.language, { notation: 'compact' });
                                return formatter.format(value);
                            }
                        }
                    },
                    y: {
                        stacked: true
                    }
                },
                responsive: true,
            };
        },


        sortedCapabilities() {
            let stack = Object.values(this.groupedCapabilities).map(caps => {
                return caps.sort((a, b) => a[`display_name_${this.language}`].localeCompare(b[`display_name_${this.language}`]))
            }).flat();
            return stack;
        },

        datasets() {
            let datasets = {};
            let i = 0;
            this.sortedCapabilities.forEach(capability => {

                for (const [facet, impactForFacet] of Object.entries(capability.userTargetImpact[this.aspect])) {
                    if (['total', 'env_overhead', 'inst_overhead'].includes(facet)) continue;

                    if (!datasets[facet]) {
                        datasets[facet] = {
                            label: this.strings[`impact_facet_label_${facet}`],
                            backgroundColor: colorForIndex(i),
                            data: [],
                        };
                    }
                    datasets[facet].data.push(impactForFacet);
                    i = i + 1;
                }

            });

            return Object.values(datasets);
        },

        chartData() {
            let chartData = {
                labels: this.sortedCapabilities.map(capability => {
                    return (capability.environment ? capability.environment[`display_name_${this.language}`] + ' - ' : '') + capability[`display_name_${this.language}`]
                }),
                datasets: this.datasets
            };
            return chartData;
        }
    }
}

</script>