
import yaml from 'js-yaml';
import useStore from '../Store.js'

export class Capability {
    constructor(payload) {

        this.id = payload.capability_id.replace(/[^a-zA-Z0-9]+/g, "");
        this.display_name_en = payload.display_name_en;
        this.display_name_fr = payload.display_name_fr;

        this.environment = useStore().environments[payload.environment_id];
        this.user_editable = payload.user_editable == 1 ? true : false;

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
        this.user_editable = payload.user_editable_range_min || payload.user_editable_range_max ? {
            range_min: payload.user_editable_range_min,
            range_max: payload.user_editable_range_max,
            step: payload.user_editable_step ? payload.user_editable_step : 1
        } : false;

        this.description = undefined;

        this.state = {
            user_target: payload.current
        }
    }

    async getDescription(language) {

        if (!this.description) {
            try {
                const verboseContentUrl = `capability_descriptions/${this.id}.yaml`;
                const response = await fetch(verboseContentUrl).then(response => response.text())

                const verboseContent = yaml.load(response, 'utf8');

                this.description = verboseContent.description;
            } catch (error) {

            }

        }

    }
}