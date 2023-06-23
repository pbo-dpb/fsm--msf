import { defineStore } from 'pinia'
import Papa from 'papaparse';
import blStrings from "./assets/strings.json?json";
import { Capability } from './models/Capability';
import { Environment } from './models/Environment';
import environments from '../src/assets/environments.json?json';
let loc = {}

const language = document.documentElement.lang;
for (const [key, value] of Object.entries(blStrings)) {
    loc[key] = value[language]
}


export default defineStore('fsm', {
    state: () => ({
        capabilities: [],
        strings: loc,
        environments: Object.fromEntries(environments.map(i => [i.id, new Environment(i)])),
    }),
    actions: {
        instanciateCapabilities(capabilities) {
            this.capabilities = capabilities.map(capObj => new Capability(capObj)).filter(x => x.id)
        },
        instanciateCapabilitiesFromCsv(rawCsv) {
            // Unpack the tsv/csv into an array of objects using papaparse
            const parsed = Papa.parse(rawCsv, { header: true, skipEmptyLines: true })
            if (parsed.errors.length > 0) {
                console.error("Failed parsing TSV.") // TODO handle error with UI feedback
                window.alert(JSON.stringify(parsed.errors))
                throw new Error(parsed.errors)
            }
            this.instanciateCapabilities(parsed.data)
        },
    },


})