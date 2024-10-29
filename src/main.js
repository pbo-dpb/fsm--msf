import { defineCustomForceStructureModelElement } from "./defineCustomForceStructureModelElement.js";
import App from "./App.ce.vue";

customElements.define(
  "pbotool-fsm",
  defineCustomForceStructureModelElement(App, {
    /*plugins: [store]*/
  })
);
