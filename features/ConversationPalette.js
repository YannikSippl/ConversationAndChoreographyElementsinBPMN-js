export default class ConversationPalette {
    constructor(create, elementFactory, palette, translate, globalConnect) {
        this.create = create;
        this.elementFactory = elementFactory;
        this.palette = palette;
        this.translate = translate;
        this.globalConnect = globalConnect;


        palette.registerProvider(this);
    }

    getPaletteEntries(element) {
        const { create, elementFactory, translate, globalConnect } = this;

        function createConversationNode(event) {
            const shape = elementFactory.createShape({ type: 'conversation:ConversationNode' });
            create.start(event, shape);
        }

        function createParticipant(event) {
            const shape = elementFactory.createShape({ type: 'conversation:Participant' });
            create.start(event, shape);
        }

        function startConversationLink(event) {
            globalConnect.start(event);
        }

        return {
            'create.conversation-node': {
                group: 'conversation',
                className: 'bpmn-icon-gateway-none',
                title: translate('Create Conversation Node'),
                action: {
                    dragstart: createConversationNode,
                    click: createConversationNode
                }
            },
            'create.participant': {
                group: 'conversation',
                className: 'bpmn-icon-participant',
                title: translate('Create Participant'),
                action: {
                    dragstart: createParticipant,
                    click: createParticipant
                }
            },
            'create.conversation-link': {
                group: 'conversation',
                className: 'bpmn-icon-screw-wrench',
                title: translate('Create Conversation Link'),
                action: {
                    dragstart: startConversationLink,
                    click: startConversationLink
                }
            }
        };
    }


}

ConversationPalette.$inject = [
    'create',
    'elementFactory',
    'palette',
    'translate',
    'globalConnect'

];