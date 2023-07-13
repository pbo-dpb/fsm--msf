
import yaml from 'js-yaml';
import useStore from '../Store.js'
import Localizer from '../Localizer.js'

export class Capability {
    constructor(payload) {

        this.id = payload.capability_id.replace(/[^a-zA-Z0-9]+/g, "");
        this.display_name_en = payload.display_name_en;
        this.display_name_fr = payload.display_name_fr;

        this.environment = useStore().environments[payload.environment_id];

        this.personnel = {
            direct: Localizer.cleanupNumber(payload.personnel_direct),
            indirect: Localizer.cleanupNumber(payload.personnel_indirect),
            env_overhead: Localizer.cleanupNumber(payload.personnel_env_overhead),
            inst_overhead: Localizer.cleanupNumber(payload.personnel_inst_overhead),
            total: Localizer.cleanupNumber(payload.personnel_total),
        }

        this.cost = {
            direct: Localizer.cleanupNumber(payload.cost_direct),
            indirect: Localizer.cleanupNumber(payload.cost_indirect),
            env_overhead: Localizer.cleanupNumber(payload.cost_env_overhead),
            inst_overhead: Localizer.cleanupNumber(payload.cost_inst_overhead),
            total: Localizer.cleanupNumber(payload.cost_total),
        }
        this.current = Localizer.cleanupNumber(payload.current);
        this.current_unit = payload.current_unit;
        const userEditableRange = Localizer.cleanupNumber(payload.user_editable_range);

        this.user_editable = userEditableRange ? {
            range_min: (this.current - userEditableRange >= 0) ? this.current - userEditableRange : 0,
            range_max: this.current + userEditableRange,
            step: payload.user_editable_step ? Localizer.cleanupNumber(payload.user_editable_step) : 1,
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

    async getDescription(language) {
        return;// TODO write descriptions
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
                impact[aspect][facet] = this[aspect][facet] + userTargetDiff * impactForFacet;
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
}