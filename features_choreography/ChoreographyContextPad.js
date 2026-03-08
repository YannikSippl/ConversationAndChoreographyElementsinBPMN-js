import { is } from 'bpmn-js/lib/util/ModelUtil';

export default class ChoreographyContextPad {
    constructor(contextPad, bpmnFactory, modeling, translate) {
        this.bpmnFactory = bpmnFactory;
        this.modeling = modeling;
        this.translate = translate;

        contextPad.registerProvider(this);
    }

    getContextPadEntries(element) {
        if (!is(element, 'choreography:ChoreographyTask')) {
            return {};
        }

        const { bpmnFactory, modeling, translate } = this;

        function addResponder(event, taskElement) {
            const taskBO = taskElement.businessObject;
            const parentBO = taskElement.parent && taskElement.parent.businessObject;

            if (!parentBO) {
                return;
            }

            const currentResponders = taskBO.participantRef || [];
            const responder = bpmnFactory.create('choreography:Responder', {
                name: `Responder ${currentResponders.length + 1}`
            });

            // Update global list of participants on process level.
            modeling.updateModdleProperties(taskElement, parentBO, {
                participants: [ ...(parentBO.participants || []), responder ]
            });

            // Reference responder from the choreography task.
            modeling.updateModdleProperties(taskElement, taskBO, {
                participantRef: [ ...currentResponders, responder ]
            });
        }

        return {
            'append.responder': {
                group: 'model',
                className: 'bpmn-icon-lane-insert-below',
                title: translate('Append Responder'),
                action: {
                    click: addResponder
                }
            }
        };
    }
}

ChoreographyContextPad.$inject = [ 'contextPad', 'bpmnFactory', 'modeling', 'translate' ];
