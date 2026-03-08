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

        return {
            'create.choreography-task': {
                group: 'choreography',
                className: 'bpmn-icon-task',
                title: translate('Create Choreography-Task'),
                action: {
                    dragstart: createChoreographyTask,
                    click: createChoreographyTask
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
