import { isAny } from 'bpmn-js/lib/util/ModelUtil';

import {
    append as svgAppend,
    attr as svgAttr,
    create as svgCreate
} from 'tiny-svg';

const CONVERSATION_NODE_TYPES = ['conversation:ConversationNode'];
const HIT_PRIORITY = 1500;

export default function ConversationInteractionEvents(eventBus, interactionEvents) {
    eventBus.on(['interactionEvents.createHit', 'interactionEvents.updateHit'], HIT_PRIORITY, function (context) {
        const { element, gfx } = context;

        if (!isAny(element, CONVERSATION_NODE_TYPES) || element.waypoints) {
            return;
        }

        interactionEvents.removeHits(gfx);
        createConversationNodeHit(gfx, element);

        // prevent lower-priority default hit creation (rectangular hit box)
        return true;
    });
}

ConversationInteractionEvents.$inject = ['eventBus', 'interactionEvents'];

function createConversationNodeHit(gfx, element) {
    const hit = svgCreate('polygon');

    svgAttr(hit, {
        class: 'djs-hit djs-hit-all',
        points: widthHeightToPoints(element.width, element.height),
        stroke: 'white',
        strokeWidth: 15,
        fill: 'white',
        fillOpacity: 0,
        strokeOpacity: 0
    });

    svgAppend(gfx, hit);

    return hit;
}

function widthHeightToPoints(width, height) {
    return [
        { x: width * 0.25, y: 0 },
        { x: width * 0.75, y: 0 },
        { x: width, y: height / 2 },
        { x: width * 0.75, y: height },
        { x: width * 0.25, y: height },
        { x: 0, y: height / 2 }
    ].map((point) => `${point.x},${point.y}`).join(' ');
}
