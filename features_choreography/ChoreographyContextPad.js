import { is } from 'bpmn-js/lib/util/ModelUtil';

export default class ChoreographyContextPad {
    constructor(config, contextPad, bpmnFactory, modeling, translate, injector, elementFactory, create) {
        this.bpmnFactory = bpmnFactory;
        this.modeling = modeling;
        this.translate = translate;
        this.elementFactory = elementFactory;
        this.create = create;
        this.autoPlace = null;

        if (config.autoPlace !== false) {
            this.autoPlace = injector.get('autoPlace', false);
        }

        contextPad.registerProvider(this);
    }

    getContextPadEntries(element) {
        if (!is(element, 'choreography:ChoreographyTask')) {
            return {};
        }

        const { bpmnFactory, modeling, translate, elementFactory, create, autoPlace } = this;

        function appendInitiatorMessage(event, element){
            const shape = elementFactory.createShape({ type: 'choreography:InitiatorMessage' });
            if (autoPlace) {
                autoPlace.append(element, shape);
            }
            else {
                create.start(event, shape, element);
            }
        }

        function appendResponseMessage(event, element){
            const shape = elementFactory.createShape({ type: 'choreography:ResponseMessage' });
            if (autoPlace) {
                autoPlace.append(element, shape);
            }
            else {
                create.start(event, shape, element);
            }
        }


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
                group: 'choreography',
                className: 'bpmn-icon-lane-insert-below',
                title: translate('Append Responder'),
                action: {
                    click: addResponder
                }
            },
            'append.initiatorMessage':{
                group: 'choreography',
                className: 'bpmn-icon-start-event-message',
                title: translate('Append Initiator Message'),
                action: {
                    dragstart: appendInitiatorMessage,
                    click: appendInitiatorMessage
                }
            },
             'append.reponseMessage':{
                group: 'choreography',
                className: 'bpmn-icon-end-event-message',
                title: translate('Append Response Message'),
                action: {
                    dragstart: appendResponseMessage,
                    click: appendResponseMessage
                }
            }
        };
    }
}

ChoreographyContextPad.$inject = [ 'config', 'contextPad', 'bpmnFactory', 'modeling', 'translate', 'injector', 'elementFactory', 'create' ];
