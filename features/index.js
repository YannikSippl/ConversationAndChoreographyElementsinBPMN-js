import ConversationRenderer from './ConversationRenderer';
import ConversationPalette from './ConversationPalette';
import ConversationRules from './ConversationRules';
import ConversationCanConnectPatch from './ConversationCanConnectPatch';

export default {
    __init__: ['conversationRenderer', 'conversationPalette', 'conversationRules', 'conversationCanConnectPatch'],
    conversationRenderer: ['type', ConversationRenderer],
    conversationPalette: ['type', ConversationPalette],
    conversationRules: ['type', ConversationRules],
    conversationCanConnectPatch: ['type', ConversationCanConnectPatch]
};
