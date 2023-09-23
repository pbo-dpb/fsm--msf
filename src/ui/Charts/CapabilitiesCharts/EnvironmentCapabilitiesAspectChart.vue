<template>
    <h3 class="text-xl font-thin flex flex-col gap-1">{{ environment[`display_name_${language}`] }}</h3>
    <div role="img" :aria-labelledby="`${uid}-description`" class="w-full" :style="{ height: `${chartHeight}rem` }">
        <Bar v-if="datasets" :options="chartOptions" :data="chartData" />
    </div>
    <!--<AspectChartTextualDescription :data="chartData" :id="`${uid}-description`"></AspectChartTextualDescription>-->
</template>
  
<script>
//import AspectChartTextualDescription from './AspectChartTextualDescription.vue';
import { mapState } from 'pinia'
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'
import { colorForIndex } from "../ColorPalettes";
import store from '../../../Store';
import { v4 as uuidv4 } from 'uuid';
import { Environment } from '../../../models/Environment';

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
        environment: {
            type: Environment,
            required: true,
        }

    },
    data() {
        return {
            uid: `aspectchart-${uuidv4()}`
        }
    },
    components: { Bar, /*AspectChartTextualDescription*/ },
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
                        },
                        min: 0,
                        max: this.aspect === 'cost' ? 1800000000 : 20000,

                    },
                    y: {
                        stacked: true,

                        afterFit: function (scaleInstance) {
                            const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
                            scaleInstance.width = vw < 768 ? 150 : 250;
                        }
                    }
                },
                responsive: true,
            };
        },


        sortedCapabilities() {
            let stack = Object.values(this.groupedCapabilities).map(caps => {
                return caps.sort((a, b) => a[`display_name_${this.language}`].localeCompare(b[`display_name_${this.language}`]))
            }).flat().filter(c => c.environment == this.environment);
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
                            barThickness: 16
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
                    const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
                    return capability[`display_name_${this.language}`].substring(0, vw < 640 ? 20 : 200)
                }),
                datasets: this.datasets
            };
            return chartData;
        },

        chartHeight() {
            const countOfCapabilities = this.sortedCapabilities.length;
            return 4 + countOfCapabilities * 2;
        }
    }
}

</script>