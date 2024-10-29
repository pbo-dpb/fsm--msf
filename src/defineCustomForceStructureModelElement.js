// Adapted from https://stackoverflow.com/questions/69808113/how-to-use-vue-router-and-vuex-inside-custom-element-from-root
import { defineCustomElement, h, createApp, getCurrentInstance } from "vue";
import stl from "./style.css?inline";
import { createPinia } from "pinia";
const pinia = createPinia();

export const defineCustomForceStructureModelElement = (
  component,
  { plugins = [] }
) =>
  defineCustomElement({
    render: () => h(component),
    styles: [stl],
    props: {
      debug: { type: String, default: false },
    },
    setup() {
      const app = createApp();
      app.use(pinia);
      plugins.forEach(app.use);
      const inst = getCurrentInstance();
      Object.assign(inst.appContext, app._context);
      Object.assign(inst.provides, app._context.provides);
    },
  });
