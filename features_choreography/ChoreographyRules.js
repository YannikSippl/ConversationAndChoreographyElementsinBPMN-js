import rulesProvider from 'diagram-js/lib/features/rules/RuleProvider';
import { isAny } from 'bpmn-js/lib/util/ModelUtil';

export default class ChoreographyRules extends rulesProvider {
    constructor(eventBus) {
        super(eventBus);
    }

    init() {

        //Choreography rules to allow resizing 
        this.addRule('shape.resize', 1500, (context) => {
            const shape = context.shape;
            if (isAny(shape, ['choreography:ChoreographyTask'])) {
                return true; // allow resizing
            }
            return;

        });
    }
}

ChoreographyRules.$inject = ['eventBus'];