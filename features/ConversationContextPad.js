export default class ConversationContextPad {
    constructor(config, contextPad, create, elementFactory, injector, translate) {
        this.create = create;
        this.elementFactory = elementFactory;
        this.translate = translate;

        // register provider if autoPlace is not disabled
        if (config.autoPlace !== false) {
            this.autoPlace = injector.get('autoPlace', false);
        }

        contextPad.registerProvider(this);
    }

    getContextPadEntries(element) {
        const { autoPlace, create, elementFactory, translate } = this;

        function appendConversationNode(event, element) {
            if (autoPlace) {
                const shape = elementFactory.createShape({ type: 'conversation:ConversationNode' });
                autoPlace.append(element, shape);
            }
            else {
                const shape = elementFactory.createShape({ type: 'conversation:ConversationNode' });
                create.start(event, shape, element);
            }
        }

        function appendConversationParticipant(event, element) {
            if (autoPlace) {
                const shape = elementFactory.createShape({ type: 'conversation:Participant' });
                autoPlace.append(element, shape);
            }
            else {
                const shape = elementFactory.createShape({ type: 'conversation:Participant' });
                create.start(event, shape, element);
            }
        }

        const customEntries = {
            'append.conversation-node': {
                group: 'model',
                className: 'bpmn-icon-gateway-none',
                title: translate('Append Conversation Node'),
                action: {
                    click: appendConversationNode,
                    dragstart: appendConversationNode
                }
            },
            'append.conversation-participant': {
                group: 'model',
                className: 'bpmn-icon-participant',
                title: translate('Append Conversation Participant'),
                action: {
                    click: appendConversationParticipant,
                    dragstart: appendConversationParticipant
                }
            }
        }

        return customEntries;

    }
}

ConversationContextPad.$inject = ['config', 'contextPad', 'create', 'elementFactory', 'injector', 'translate'];