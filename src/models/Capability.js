
import yaml from 'js-yaml';
import useStore from '../Store.js'

export class Capability {
    constructor(payload) {

        this.id = payload.capability_id;
        this.display_name_en = payload.display_name_en;
        this.display_name_fr = payload.display_name_fr;

        this.environment = useStore().environments[payload.environment_id];
        this.user_editable = payload.user_editable ? true : false;

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
        this.range_min = payload.range_min;
        this.range_max = payload.range_max;

        this.description = { en: '⚠️', fr: '⚠️' };

        this.getDescription();
    }

    async getDescription(language) {

        if (!this.description) {
            try {
                const verboseContentUrl = `${this.id}.yaml`;
                const response = await fetch(verboseContentUrl).then(response => response.text())

                const verboseContent = yaml.load(response, 'utf8');
                this.description = verboseContent.description;
            } catch (error) {

            }

        }

    }
}