import ConversationRenderer from './ConversationRenderer';
import ConversationPalette from './ConversationPalette';

export default {
    __init__: ['conversationRenderer', 'conversationPalette'],
    conversationRenderer: ['type', ConversationRenderer],
    conversationPalette: ['type', ConversationPalette]
};
