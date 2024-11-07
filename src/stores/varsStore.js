import { defineStore } from "pinia";
import readXlsxFile from "read-excel-file";

export const useVarsStore = defineStore("vars", {
  state: () => ({
    vars: {},
  }),

  actions: {
    async loadVars(blob) {
      let vars = await readXlsxFile(blob, { sheet: "VARS" });
      this.vars = vars.reduce((accumulator, item) => {
        if (item[2]) {
          accumulator[item[0]] = { en: item[1], fr: item[2] };
        } else {
          let accumulatorContent = item[1];
          if (accumulatorContent === "TRUE") accumulatorContent = true;
          if (accumulatorContent === "FALSE") accumulatorContent = false;
          accumulator[item[0]] = accumulatorContent;
        }
        return accumulator;
      }, {});
    },
  },
});
