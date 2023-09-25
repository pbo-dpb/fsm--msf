<template>
    <div class="flex flex-col gap-4">


        <div role="img" :aria-labelledby="`${uid}-description`" class="h-64">
            <Bar :id="uid" :options="chartOptions" :data="chartData" />
        </div>
        <GlobalSummaryChartTextualDescription :data="chartData" :id="`${uid}-description`">
        </GlobalSummaryChartTextualDescription>
    </div>
</template>
<script>
import store from '../../../Store';
import { mapState } from 'pinia'
import { Bar } from 'vue-chartjs'
import { v4 as uuidv4 } from 'uuid';
import { colorForIndex } from "../ColorPalettes";
import Localizer from '../../../Localizer';
import GlobalSummaryChartTextualDescription from "./GlobalSummaryChartTextualDescription.vue"

export default {
    name: 'BarChart',
    components: { Bar, GlobalSummaryChartTextualDescription },
    computed: {
        ...mapState(store, ["capabilities", "strings", 'groupedCapabilities', 'language', 'userTargets']),
        groups() {
            return Object.values(this.groupedCapabilities).map((gr) => {
                return {
                    name: gr[0]?.environment[`display_name_${this.language}`],
                    costs: this.userTargets(gr).cost
                }
            })
        },
        generalOverhead() {
            return this.capabilities.reduce((accumulator, capability) => {
                return accumulator + capability.userTargetImpact['cost'].inst_overhead;
            }, 0)
        },
        labels() {
            const labels = [
                ...this.groups.map((gr) => gr.name),
                this.strings.impact_facet_label_inst_overhead
            ];
            return labels
        },
        chartData() {

            return {
                labels: this.labels,
                datasets: [
                    {
                        label: this.strings.impact_facet_label_direct,
                        data: [
                            ...this.groups.map((gr) => gr.costs.direct),
                            0
                        ],
                        backgroundColor: [
                            colorForIndex(0),
                        ]
                    },
                    {
                        label: this.strings.impact_facet_label_indirect,
                        data: [
                            ...this.groups.map((gr) => gr.costs.indirect),
                            , 0
                        ],
                        backgroundColor: [
                            colorForIndex(1),
                        ]
                    },
                    {
                        label: this.strings.generic_overhead,
                        data: [
                            ...this.groups.map((gr) => gr.costs.env_overhead),
                            this.generalOverhead
                        ],
                        backgroundColor: [
                            colorForIndex(2),
                        ]
                    },
                ]
            }
        },
        chartOptions() {
            return {
                maintainAspectRatio: false,
                indexAxis: 'y',
                plugins: {
                    legend: {
                        position: "bottom"
                    },

                },
                responsive: true,
                scales: {
                    x: {
                        stacked: true,
                        ticks: {
                            callback: (value, index, ticks) => {
                                return Localizer.formatNumber(value, this.language, 'currency');
                            }
                        },
                        min: 0,
                        max: 7000000000
                    },
                    y: {
                        stacked: true
                    }
                }
            };
        },

    },

    data() {
        return {
            uid: `globalsummarychart-${uuidv4()}`
        }
    },
}
</script>