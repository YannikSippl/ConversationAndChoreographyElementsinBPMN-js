import { isAny } from 'bpmn-js/lib/util/ModelUtil';

const CONVERSATION_ENDPOINTS = [
    'conversation:ConversationNode',
    'conversation:Participant'
];

export default function ConversationCanConnectPatch(bpmnRules) {
    const originalCanConnect = bpmnRules.canConnect.bind(bpmnRules);

    bpmnRules.canConnect = function (source, target, connection) {
        if (
            isAny(source, CONVERSATION_ENDPOINTS) &&
            isAny(target, CONVERSATION_ENDPOINTS)
        ) {
            return { type: 'conversation:ConversationLink' };
        }

        return originalCanConnect(source, target, connection);
    };
}

ConversationCanConnectPatch.$inject = ['bpmnRules'];
