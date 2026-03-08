export default class ChoreographyPalette {
    constructor(create, elementFactory, palette, translate){
        this.create = create;
        this.elementFactory = elementFactory;
        this.palette = palette;
        this.translate = translate;

        palette.registerProvider(500, this);
    }

    getPaletteEntries(){
        const { create, elementFactory, translate } = this;

        function createChoreographyTask(event) {
            const shape = elementFactory.createShape({ type: 'choreography:ChoreographyTask' });
            create.start(event, shape);
        }
        function createInitiatorMessage(event){
            const shape = elementFactory.createShape({ type: 'choreography:InitiatorMessage' });
            create.start(event, shape);
        }

        function createResponseMessage(event){
            const shape = elementFactory.createShape({ type: 'choreography:ResponseMessage' });
            create.start(event, shape);
        }

        return {
            'create.choreography-task': {
                group: 'choreography',
                className: 'bpmn-icon-lane-divide-three',
                title: translate('Create Choreography-Task'),
                action: {
                    dragstart: createChoreographyTask,
                    click: createChoreographyTask
                }
            },
            'create.initiatingMessage': {
                group: 'choreography',
                className: 'bpmn-icon-start-event-message',
                title: translate('Create initiating Message'),
                action: {
                    dragstart: createInitiatorMessage,
                    click: createInitiatorMessage
                }
            },
             'create.responseMessage': {
                 group: 'choreography',
                className: 'bpmn-icon-end-event-message',
                title: translate('Create response Message'),
                action: {
                    dragstart: createResponseMessage,
                    click: createResponseMessage
                }
            }
        };
    }
    
}

ChoreographyPalette.$inject = [
    'create',
    'elementFactory',
    'palette',
    'translate'
];
