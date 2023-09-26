<template>
    <div class="w-full" :style="{ height: `${chartHeight}rem` }">
        <Bar v-if="chartData" :options="chartOptions" :data="chartData" />
    </div>
</template>
  
<script>
import { mapState } from 'pinia'
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Tooltip, Legend, BarElement, LinearScale, CategoryScale } from 'chart.js'
import store from '../../../Store';
import Localizer from '../../../Localizer';
ChartJS.register(Tooltip, Legend, BarElement, CategoryScale, LinearScale)

export default {
    props: {

        xMax: {
            type: Number,
            required: true
        },
        chartData: {
            type: Object,
            required: true,
        }

    },

    components: { Bar, /*AspectChartTextualDescription*/ },
    computed: {
        ...mapState(store, ["strings", 'capabilities', 'groupedCapabilities', 'language', 'vars', 'settings_selectedAspect']),

        chartOptions() {
            return {
                maintainAspectRatio: false,
                indexAxis: 'y',
                plugins: {
                    legend: {
                        position: "top"
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                if (this.settings_selectedAspect === "cost")
                                    return new Intl.NumberFormat(`${this.language}-CA`, { style: 'currency', "currency": "CAD", maximumFractionDigits: 0, notation: 'compact' }).format(context.raw);
                                return new Intl.NumberFormat(`${this.language}-CA`).format(context.parsed.x)
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        stacked: true,
                        ticks: {
                            callback: (value, index, ticks) => {
                                if (this.settings_selectedAspect === "cost")
                                    return new Intl.NumberFormat(`${this.language}-CA`, { style: 'currency', "currency": "CAD", maximumFractionDigits: 0, notation: 'compact' }).format(value);
                                return new Intl.NumberFormat(`${this.language}-CA`, { notation: 'compact' }).format(value)
                            },
                            color: "rgba(255,255,255,0)"
                        },
                        min: 0,
                        max: this.xMax,

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





        chartHeight() {
            return 4 + this.chartData?.datasets[0]?.data?.length * 2;
        }
    }
}

</script>