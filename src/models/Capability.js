
import yaml from 'js-yaml';
import useStore from '../Store.js'
import Localizer from '../Localizer.js'
import readXlsxFile from 'read-excel-file'

export class Capability {
    constructor(payload) {

        this.id = payload.id;
        this.display_name_en = payload.display_name_en;
        this.display_name_fr = payload.display_name_fr;

        this.specific_note_en = payload.specific_note_en;
        this.specific_note_fr = payload.specific_note_fr;
        this.environment = useStore().environments.find(env => env.id === payload.environment_id);

        this.personnel = {
            direct: payload.personnel_direct,
            indirect: payload.personnel_indirect,
            env_overhead: payload.personnel_env_overhead,
            inst_overhead: payload.personnel_inst_overhead,
            total: payload.personnel_total,
        }

        this.cost = {
            direct: payload.cost_direct,
            indirect: payload.cost_indirect,
            env_overhead: payload.cost_env_overhead,
            inst_overhead: payload.cost_inst_overhead,
            total: payload.cost_total,
        }
        this.current = payload.current;
        this.current_unit = payload.current_unit;
        const userEditableRange = payload.user_editable_range;

        this.user_editable = userEditableRange ? {
            range_min: (this.current - userEditableRange >= 0) ? this.current - userEditableRange : 0,
            range_max: this.current + userEditableRange,
            step: payload.user_editable_step ? payload.user_editable_step : 1,
            range: userEditableRange
        } : false;

        this.description = undefined;

        this.state = {
            user_target: payload.current
        }
    }

    get hasUserTarget() {
        return this.state.user_target != this.current;
    }



    get userTargetDiff() {
        return -(this.current - this.state.user_target);
    }

    get userTargetImpact() {
        let impact = {};
        let userTargetDiff = this.userTargetDiff;
        for (const [aspect, aspectFacets] of Object.entries(this.impactPerUnit)) {
            if (!impact[aspect]) {
                impact[aspect] = {};
            }
            for (const [facet, impactForFacet] of Object.entries(aspectFacets)) {

                let value = this[aspect][facet] + userTargetDiff * impactForFacet;
                let roundedNum = aspect === 'cost' ? (Math.round(value / 10000000) * 10000000) : (Math.round(value / 100) * 100);

                impact[aspect][facet] = roundedNum;
            }

        }
        return impact;
    }

    get impactPerUnit() {
        return {
            personnel: {
                direct: this.personnel.direct / this.current,
                indirect: this.personnel.indirect / this.current,
                env_overhead: this.personnel.env_overhead / this.current,
                inst_overhead: this.personnel.inst_overhead / this.current,
                total: this.personnel.total / this.current,
            },
            cost: {
                direct: this.cost.direct / this.current,
                indirect: this.cost.indirect / this.current,
                env_overhead: this.cost.env_overhead / this.current,
                inst_overhead: this.cost.inst_overhead / this.current,
                total: this.cost.total / this.current,
            }
        }
    }

    static async LoadFromXlsxBlob(blob) {
        /**
             * Instanciate capabilities
             */
        const schema = {
            'capability_id': {
                prop: 'id',
                required: true,
                type: (value) => {
                    const id = value.replace(/[^a-zA-Z0-9]+/g, "")
                    if (!id) {
                        throw new Error('invalid id')
                    }
                    return id
                }
            },
            'display_name_en': {
                required: true,
                prop: 'display_name_en',
            },
            'display_name_fr': {
                required: true,
                prop: 'display_name_fr'
            },
            'specific_note_en': {
                required: false,
                prop: 'specific_note_en',
            },
            'specific_note_fr': {
                required: false,
                prop: 'specific_note_fr'
            },
            'environment_id': {
                prop: 'environment_id',
                oneOf: useStore().environments.map(e => e.id)
            },
            'personnel_direct': {
                required: true,
                'prop': 'personnel_direct',
                type: Number,
            },
            'personnel_indirect': {
                required: true,
                prop: 'personnel_indirect',
                type: Number,
            },
            'personnel_env_overhead': {
                required: true,
                prop: 'personnel_env_overhead',
                type: Number,
            },
            'personnel_inst_overhead': {
                required: true,
                prop: "personnel_inst_overhead",
                type: Number,
            },
            'personnel_total': {
                required: true,
                prop: "personnel_total",
                type: Number,
            },
            'cost_direct': {
                required: true,
                prop: "cost_direct",
                type: Number,
            },
            'cost_indirect': {
                required: true,
                prop: 'cost_indirect',
                type: Number,
            },
            'cost_env_overhead': {
                required: true,
                prop: 'cost_env_overhead',
                type: Number,
            },
            'cost_inst_overhead': {
                required: true,
                prop: 'cost_inst_overhead',
                type: Number,
            },
            'cost_total': {
                required: true,
                prop: 'cost_total',
                type: Number,
            },
            'current': {
                required: true,
                prop: 'current',
                type: Number,
            },
            'current_unit': {
                required: true,
                prop: 'current_unit',
                oneOf: ['countable', 'percent', 'currency']
            },
            'user_editable_range': {
                required: true,
                prop: 'user_editable_range',
                type: Number,
            },
            'user_editable_step': {
                required: true,
                prop: 'user_editable_step',
                type: Number,
            }
        }

        let parsed = await readXlsxFile(blob, { sheet: 'CAPABILITIES', schema });


        const descSchema = {
            'capability_id': {
                prop: 'id',
                required: true,
                type: (value) => {
                    const id = value.replace(/[^a-zA-Z0-9]+/g, "")
                    if (!id) {
                        throw new Error('Invalid id')
                    }
                    return id
                }
            },
            'en': {
                prop: 'en',
            },
            'fr': {
                prop: 'fr'
            }
        }



        let descriptions = await readXlsxFile(blob, { sheet: 'DESCRIPTIONS', schema: descSchema });


        const capabilities = parsed.errors.length ? null : parsed.rows.map(x => {
            let cap = new Capability(x);

            const desc = descriptions.rows.find(x => x.id == cap.id);
            if (desc)
                cap.description = {
                    en: desc.en,
                    fr: desc.fr
                }
            return cap;
        })



        return {
            ...parsed,
            errors: [
                ...parsed.errors,
                ...descriptions.errors
            ],
            capabilities,
        }
    }
}