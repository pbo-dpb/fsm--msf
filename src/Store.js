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
        settings_perUnitDisplay: false,
    }),
    actions: {
        instanciateCapabilities(capabilities) {
            this.capabilities = capabilities.map(capObj => new Capability(capObj)).filter(x => x.id)
        },
        instanciateCapabilitiesFromCsv(rawCsv) {
            // Unpack the tsv/csv into an array of objects using papaparse
            const parsed = Papa.parse(rawCsv, { header: true, skipEmptyLines: true })
            if (parsed.errors.length > 0) {
                console.error("Failed parsing CSV.") // TODO handle error with UI feedback
                window.alert(JSON.stringify(parsed.errors))
                throw new Error(parsed.errors)
            }
            this.instanciateCapabilities(parsed.data)
        },
    },

    getters: {


        groupedCapabilities(state) {

            if (!state.capabilities || state.capabilities.length === 0) return [];
            let groups = {};
            state.capabilities.forEach((capability) => {
                const key = capability.environment?.id ?? null;
                if (!groups[key]) {
                    groups[key] = [];
                }
                groups[key].push(capability);
                return groups;
            })
            return groups

        },

        currentAspects(state) {

            return state.capabilities.reduce((acc, capability) => {

                for (const [facet, impactForFacet] of Object.entries(capability.personnel)) {
                    if (!acc.personnel[facet]) {
                        acc.personnel[facet] = 0;
                    }
                    acc.personnel[facet] = acc.personnel[facet] + capability.personnel[facet];
                }

                for (const [facet, impactForFacet] of Object.entries(capability.cost)) {
                    if (!acc.cost[facet]) {
                        acc.cost[facet] = 0;
                    }
                    acc.cost[facet] = acc.cost[facet] + capability.cost[facet];
                }

                return acc;
            }, {
                personnel: {},
                cost: {}
            });

        },

        hasCustomUserTargets(state) {
            return state.capabilities.some(capability => capability.hasUserTarget);
        },

        userTargets(state) {

            return state.capabilities.reduce((acc, capability) => {

                for (const [facet, impactForFacet] of Object.entries(capability.userTargetImpact.personnel)) {
                    if (!acc.personnel[facet]) {
                        acc.personnel[facet] = 0;
                    }
                    acc.personnel[facet] = acc.personnel[facet] + capability.userTargetImpact.personnel[facet];
                }

                for (const [facet, impactForFacet] of Object.entries(capability.userTargetImpact.cost)) {
                    if (!acc.cost[facet]) {
                        acc.cost[facet] = 0;
                    }
                    acc.cost[facet] = acc.cost[facet] + capability.userTargetImpact.cost[facet];
                }

                return acc;
            }, {
                personnel: {},
                cost: {}
            });

        }

    }


})