<template>
  <div class="h-32">
    <Bar :id="uid" :options="chartOptions" :data="chartData" />
  </div>
</template>
<script>
import store from '../../../Store';
import { mapState } from 'pinia'
import { Bar } from 'vue-chartjs'
import { v4 as uuidv4 } from 'uuid';
import { colorForIndex } from "../ColorPalettes";

export default {
  name: 'BarChart',
  components: { Bar },
  computed: {
    ...mapState(store, ["strings", 'capabilities', 'groupedCapabilities', 'settings_selectedAspect']),
    labels() {
      return [
        this.strings.general_overhead_label,
        ...Object.keys(this.environmentOverheads),
      ]
    },
    data() {
      return [
        this.generalOverhead,
        ...Object.values(this.environmentOverheads)
      ];
    },
    chartData() {
      return {
        labels: this.labels,
        datasets: [{
          data: this.data,
          backgroundColor: [
            colorForIndex(2),
            ...Object.keys(this.environmentOverheads).map((e) => colorForIndex(3))
          ]
        }]
      }
    },
    chartOptions() {
      return {
        maintainAspectRatio: false,
        indexAxis: 'y',
        plugins: {
          legend: {
            display: false
          }
        },
        responsive: true,
        scales: {
          x: {
            ticks: {
              callback: function (value, index, ticks) {
                const formatter = Intl.NumberFormat(document.documentElement.lang, { notation: 'compact' });
                return formatter.format(value);
              }
            }
          }
        }
      };
    },

    generalOverhead() {
      return this.capabilities.reduce((accumulator, capability) => {
        return accumulator + capability.userTargetImpact[this.settings_selectedAspect].inst_overhead;
      }, 0)
    },
    environmentOverheads() {

      let envKv = {};

      Object.values(this.groupedCapabilities).forEach(gr => {
        let environment = gr[0]?.environment;
        if (!environment)
          return;

        if (['Joint'].includes(environment.id))
          return;

        let label = this.strings.per_environment_env_overhead_label.replace(':environment', environment?.[`display_name_${document.documentElement.lang}`]);

        envKv[label] = gr.reduce((accumulator, capability) => {
          return accumulator + capability.userTargetImpact[this.settings_selectedAspect].env_overhead;
        }, 0);
      });

      return envKv;

    }
  },
  data() {
    return {
      uid: `overheadchart-${uuidv4()}`
    }
  },
}
</script>