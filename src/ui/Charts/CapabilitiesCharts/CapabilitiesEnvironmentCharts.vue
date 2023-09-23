<template>
    <div class="w-full flex flex-col gap-2">
        <h3 class="text-xl font-thin flex flex-col gap-1">{{ environment[`display_name_${language}`] }}</h3>

        <div role="img" :aria-labelledby="`${uid}-description`" class="w-full flex flex-col gap-2">
            <EnvironmentCapabilitiesAspectChart :x-max="xMax" :chart-data="environmentCapabilitiesChartData">
            </EnvironmentCapabilitiesAspectChart>

            <EnvironmentOverheadChart :x-max="xMax" :chart-data="environmentOverheadChartData">
            </EnvironmentOverheadChart>
        </div>


        <CapabilitiesChartTextualDescription :id="`${uid}-description`"
            :environment-overhead-chart-data="environmentOverheadChartData"
            :environment-capabilities-chart-data="environmentCapabilitiesChartData"></CapabilitiesChartTextualDescription>

    </div>
</template>
  
<script>
import { mapState } from 'pinia'
import store from '../../../Store';
import { colorForIndex } from "../ColorPalettes";
import { v4 as uuidv4 } from 'uuid';

import EnvironmentCapabilitiesAspectChart from './EnvironmentCapabilitiesAspectChart.vue';
import EnvironmentOverheadChart from './EnvironmentOverheadChart.vue';
import CapabilitiesChartTextualDescription from './CapabilitiesChartTextualDescription.vue';

import { Environment } from '../../../models/Environment';

export default {
    components: { EnvironmentCapabilitiesAspectChart, EnvironmentOverheadChart, CapabilitiesChartTextualDescription },
    props: {
        environment: Environment,
        required: true
    },
    data() {
        return {
            barThickness: 16,
            uid: `capenvcharts-${uuidv4()}`
        }
    },
    computed: {
        ...mapState(store, ["strings", "settings_selectedAspect", "environments", 'capabilities', 'groupedCapabilities', 'language', 'vars', "userTargets"]),

        sortedCapabilities() {
            let stack = Object.values(this.groupedCapabilities).map(caps => {
                return caps.sort((a, b) => a[`display_name_${this.language}`].localeCompare(b[`display_name_${this.language}`]))
            }).flat().filter(c => c.environment == this.environment);
            return stack;
        },

        xMax() {
            return this.settings_selectedAspect === 'cost' ? 2500000000 : 25000;
        },


        environmentOverheadChartData() {
            let chartData = {
                labels: [this.strings.impact_facet_label_env_overhead],
                datasets: [
                    {
                        label: this.strings[`impact_facet_label_env_overhead`],
                        backgroundColor: colorForIndex(2),
                        data: [
                            this.sortedCapabilities.reduce((acc, capability) => {
                                return acc + capability.userTargetImpact[this.settings_selectedAspect]['env_overhead']
                            }, 0)
                        ],
                        barThickness: this.barThickness
                    }
                ]
            };
            return chartData;
        },


        environmentCapabilitiesChartData() {


            let datasets = {};
            let i = 0;
            this.sortedCapabilities.forEach(capability => {

                for (const [facet, impactForFacet] of Object.entries(capability.userTargetImpact[this.settings_selectedAspect])) {
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


            return {
                labels: this.sortedCapabilities.map(capability => {
                    const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
                    return capability[`display_name_${this.language}`].substring(0, vw < 640 ? 20 : 200)
                }),
                datasets: Object.values(datasets)
            };



        }
    },

}
</script>