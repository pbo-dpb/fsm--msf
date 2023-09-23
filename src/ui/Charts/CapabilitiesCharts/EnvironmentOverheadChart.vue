<template>
    <div role="img" :aria-labelledby="`${uid}-description`" class="w-full h-16 -mt-8">
        <Bar v-if="datasets" :options="chartOptions" :data="chartData" />
    </div>
</template>
  
<script>
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
        ...mapState(store, ["strings", 'capabilities', 'groupedCapabilities', 'language', 'vars', "userTargets"]),



        chartOptions() {
            return {
                maintainAspectRatio: false,
                indexAxis: 'y',
                plugins: {
                    legend: {
                        position: false
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
                        max: this.aspect === 'cost' ? 2500000000 : 25000,

                    },
                    y: {
                        stacked: true,
                        ticks: {
                            font: {
                                weight: "bold"
                            }
                        },
                        afterFit: function (scaleInstance) {
                            const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
                            scaleInstance.width = vw < 768 ? 150 : 250;
                        },

                    }
                },
                responsive: true,
            };
        },


        sortedCapabilities() {
            let stack = Object.values(this.groupedCapabilities).flat().filter(c => c.environment == this.environment);
            return stack;
        },

        datasets() {

            return [
                {
                    label: this.strings[`impact_facet_label_env_overhead`],
                    backgroundColor: colorForIndex(2),
                    data: [
                        this.sortedCapabilities.reduce((acc, capability) => {
                            return acc + capability.userTargetImpact[this.aspect]['env_overhead']
                        }, 0)
                    ],
                    barThickness: 16
                }
            ]
        },

        chartData() {
            let chartData = {
                labels: [this.strings.impact_facet_label_env_overhead],
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