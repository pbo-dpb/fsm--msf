import { defineCustomForceStructureModelElement } from './defineCustomForceStructureModelElement.js'
import App from "./App.ce.vue"
import store from './Store.js'

customElements.define('pbotool-fsm', defineCustomForceStructureModelElement(App, { /*plugins: [store]*/ }))