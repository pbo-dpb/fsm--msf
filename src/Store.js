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
        meta: null,
        environments: Object.fromEntries(environments.map(i => [i.id, new Environment(i)])),
        settings_perUnitDisplay: false,
        settings_selectedAspect: "cost",
    }),
    actions: {
        instanciateCapabilities(capabilities) {
            this.capabilities = capabilities.map(capObj => new Capability(capObj)).filter(x => x.id)
        },
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

            let groups = {};

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