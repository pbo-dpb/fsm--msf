import { defineStore } from 'pinia'
import blStrings from "./assets/strings.json?json";
import { Capability } from './models/Capability';
import { Environment } from './models/Environment';
import environments from '../src/assets/environments.json?json';

import readXlsxFile from 'read-excel-file'


let loc = {}


export default defineStore('fsm', {
    state: () => ({
        language: document.documentElement.lang,
        errors: null,
        capabilities: null,
        vars: {},
        environments: environments.map(i => new Environment(i)),
        settings_perUnitDisplay: false,
        settings_selectedAspect: "cost",
    }),
    actions: {

        async instanciateStore(blob) {
            this.errors = null;


            /**
             * Instanciate capabilities
             */
            let capabilities = await Capability.LoadFromXlsxBlob(blob);

            if ([capabilities].find(x => x.errors.length > 0)) {
                this.errors = {
                    CAPABILITIES: capabilities.errors
                }
                return;
            }

            /**
            * Vars
            */
            let vars = await readXlsxFile(blob, { sheet: 'VARS' });
            this.vars = vars.reduce((accumulator, item) => {
                if (item[2]) {
                    accumulator[item[0]] = { en: item[1], fr: item[2] };
                } else {
                    let accumulatorContent = item[1];
                    // Strings can be casted to bool for vars.
                    if (accumulatorContent === "TRUE") accumulatorContent = true;
                    if (accumulatorContent === "FALSE") accumulatorContent = false;
                    accumulator[item[0]] = accumulatorContent
                }
                return accumulator;
            }, {});


            this.capabilities = capabilities.capabilities



        },
    },

    getters: {
        strings(state) {
            let loc = {}
            for (const [key, value] of Object.entries(blStrings)) {
                loc[key] = value[state.language]
            }
            return loc;
        },

        groupedCapabilities(state) {

            if (!state.capabilities || state.capabilities.length === 0) return [];

            let groups = Object.fromEntries(state.environments.map(i => [i.id, []]));

            state.capabilities.forEach((capability) => {
                if (!capability.environment) return;
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

            return (group) => {


                let capabilities = group ? group : state.capabilities;

                return capabilities.reduce((acc, capability) => {

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
            }
        },

        hasCustomUserTargets(state) {
            return (group) => {
                let capabilities = group ? group : state.capabilities;
                return capabilities.some(capability => capability.hasUserTarget)
            };
        },

        userTargets(state) {

            return (group) => {

                let capabilities = group ? group : state.capabilities;

                return capabilities.reduce((acc, capability) => {

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

    }


})