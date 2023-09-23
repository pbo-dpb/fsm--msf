<template>
    <div role="img" :aria-labelledby="`${uid}-description`" class="w-full h-16 -mt-8">
        <Bar v-if="chartData" :options="chartOptions" :data="chartData" />
    </div>
</template>
  
<script>
import { mapState } from 'pinia'
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Tooltip, Legend, BarElement, LinearScale, CategoryScale } from 'chart.js'
import store from '../../../Store';
import { v4 as uuidv4 } from 'uuid';

ChartJS.register(Tooltip, Legend, BarElement, CategoryScale, LinearScale)

export default {
    props: {

        chartData: {
            type: Object,
            required: true
        },


        xMax: {
            type: Number,
            required: true
        }

    },
    data() {
        return {
            uid: `envoverchart-${uuidv4()}`
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
                        max: this.xMax,

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





    }
}

</script>