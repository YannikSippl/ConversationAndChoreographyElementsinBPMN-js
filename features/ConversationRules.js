import rulesProvider from 'diagram-js/lib/features/rules/RuleProvider';
import { isAny } from 'bpmn-js/lib/util/ModelUtil';

export default class ConversationRules extends rulesProvider {
    constructor(eventBus) {
        super(eventBus);
    }

    init() {

        //Conversation Nodes and Participants rules to allow resizing 
        this.addRule('shape.resize', 1500, (context) => {
            const shape = context.shape;
            if (isAny(shape, ['conversation:ConversationNode', 'conversation:Participant'])) {
                return true; // allow resizing
            }
            return;

        });
        // Conversation Links rules 
        this.addRule('connection.create', 1500, (context) => {
            const { source, target } = context;

            if (isAny(source, ['conversation:ConversationNode', 'conversation:Participant']) &&
                isAny(target, ['conversation:ConversationNode', 'conversation:Participant'])) {

                //Connect Preview needs a type as retrun value to display the connection during creation
                return { type: 'conversation:ConversationLink' };
            }
            return;
        });

        this.addRule('connection.reconnect', 1500, (context) => {
            const { connection, source, target } = context;

            if (!isAny(connection, ['conversation:ConversationLink'])) {
                return;
            }
            if (isAny(source, ['conversation:ConversationNode', 'conversation:Participant']) &&
                isAny(target, ['conversation:ConversationNode', 'conversation:Participant'])) {
                return { type: 'conversation:ConversationLink' };
            }
            return false;
        });
    }
}

ConversationRules.$inject = ['eventBus'];