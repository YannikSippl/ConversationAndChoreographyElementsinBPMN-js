import ConversationRenderer from './ConversationRenderer';
import ConversationPalette from './ConversationPalette';
import ConversationRules from './ConversationRules';
import ConversationCanConnectPatch from './ConversationCanConnectPatch';
import ConversationInteractionEvents from './ConversationInteractionEvents';

export default {
    __init__: ['conversationRenderer', 'conversationPalette', 'conversationRules', 'conversationCanConnectPatch', 'conversationInteractionEvents'],
    conversationRenderer: ['type', ConversationRenderer],
    conversationPalette: ['type', ConversationPalette],
    conversationRules: ['type', ConversationRules],
    conversationCanConnectPatch: ['type', ConversationCanConnectPatch],
    conversationInteractionEvents: ['type', ConversationInteractionEvents]
};
