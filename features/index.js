import ConversationRenderer from './ConversationRenderer';
import ConversationPalette from './ConversationPalette';
import ConversationRules from './ConversationRules';
import ConversationCanConnectPatch from './ConversationCanConnectPatch';
import ConversationInteractionEvents from './ConversationInteractionEvents';
import ConversationOutlineProvider from './ConversationOutlineProvider';

export default {
    __init__: ['conversationRenderer', 'conversationPalette', 'conversationRules', 'conversationCanConnectPatch', 'conversationInteractionEvents', 'conversationOutlineProvider'],
    conversationRenderer: ['type', ConversationRenderer],
    conversationPalette: ['type', ConversationPalette],
    conversationRules: ['type', ConversationRules],
    conversationCanConnectPatch: ['type', ConversationCanConnectPatch],
    conversationInteractionEvents: ['type', ConversationInteractionEvents],
    conversationOutlineProvider: ['type', ConversationOutlineProvider]
};
