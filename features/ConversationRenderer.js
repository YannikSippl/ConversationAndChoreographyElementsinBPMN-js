import BaseRenderer from 'diagram-js/lib/draw/BaseRenderer';

import {
    append as svgAppend,
    attr as svgAttr,
    create as svgCreate
} from 'tiny-svg';


import { isAny } from 'bpmn-js/lib/util/ModelUtil';

const HIGH_PRIORITY = 1500;

//register CustomRenderer at eventBus with high priority, so it will be used before the default renderer
export default class ConversationRenderer extends BaseRenderer {
    constructor(eventBus, bpmnRenderer, canvas, elementRegistry) {
        super(eventBus, HIGH_PRIORITY);

        this.bpmnRenderer = bpmnRenderer;

        // Keep conversation links visually behind conversation nodes.
        const reorderConversationGraphics = () => {
            const nodes = elementRegistry.filter((el) => isAny(el, ['conversation:ConversationNode']));
            const links = elementRegistry.filter((el) => isAny(el, ['conversation:ConversationLink']));

            if (!nodes.length || !links.length) {
                return;
            }

            const firstNodeGfx = canvas.getGraphics(nodes[0]);
            if (!firstNodeGfx || !firstNodeGfx.parentNode) {
                return;
            }

            links.forEach((link) => {
                const linkGfx = canvas.getGraphics(link);
                if (!linkGfx || !linkGfx.parentNode) {
                    return;
                }

                // Same SVG group: put connection gfx before node gfx.
                if (linkGfx.parentNode === firstNodeGfx.parentNode) {
                    linkGfx.parentNode.insertBefore(linkGfx, firstNodeGfx);
                    return;
                }

                // Different groups under same root: move whole connection group before node group.
                const linkGroup = linkGfx.parentNode;
                const nodeGroup = firstNodeGfx.parentNode;
                const root = nodeGroup.parentNode;

                if (root && linkGroup.parentNode === root) {
                    root.insertBefore(linkGroup, nodeGroup);
                }
            });
        };

        eventBus.on('import.done', 500, reorderConversationGraphics);
        eventBus.on('connection.added', 500, reorderConversationGraphics);
        eventBus.on('connection.changed', 500, reorderConversationGraphics);
        eventBus.on('elements.changed', 500, reorderConversationGraphics);
    }

    canRender(element) {
        const match = isAny(element, ['conversation:ConversationNode', 'conversation:ConversationLink']);
        return match;
    }

    // override default shape and connection drawing for ConversationNode and ConversationLink, otherwise fallback to default renderer
    drawShape(parentNode, element) {
        if (isAny(element, ['conversation:ConversationNode'])) {
            const hexagon = drawHexagon(parentNode, element); // new hexagon shape for ConversationNode
            return hexagon;
        }


        const shape = this.bpmnRenderer.drawShape(parentNode, element);
        return shape;
    }

    drawConnection(parentNode, element) {
        if (isAny(element, ['conversation:ConversationLink'])) {
            const path = drawConversationLink(parentNode, element); // new path for ConversationLink
            return path;

        }
        return this.bpmnRenderer.drawConnection(parentNode, element);
    }

    // use hexagon path for ConversationNode borders
    getShapePath(shape) {
        if (isAny(shape, ['conversation:ConversationNode'])) {
            return getHexagonPath(shape);
        }
    }
    // use custom path for ConversationLink borders
    getConnectionPath(connection) {
        if (isAny(connection, ['conversation:ConversationLink'])) {
            return toConnectionPath(connection.waypoints);
        }
    }
}

// inject dependencies
ConversationRenderer.$inject = ['eventBus', 'bpmnRenderer', 'canvas', 'elementRegistry'];




// ----- helper functions -----

//creating a hexagon shape for Conversation Nodes
function drawHexagon(parentNode, element) {
    const hexagon = svgCreate('polygon');

    const points = widthHeightToPoints(element.width, element.height);
    svgAttr(hexagon, {
        points,
        fill: '#1302fa',
        stroke: '#0f0475',
        strokeWidth: 2
    })

    svgAppend(parentNode, hexagon);

    return hexagon;
};

//creating a custom path for Conversation Links
function drawConversationLink(parentNode, element) {
    const d = toConnectionPath(element.waypoints);

    const base = svgCreate('path');
    svgAttr(base, {
        d,
        fill: 'none',
        stroke: '#000',
        strokeWidth: 12,
        strokeLinecap: 'round',
        strokeLinejoin: 'round'
    });
    svgAppend(parentNode, base);

    const gap = svgCreate('path');
    svgAttr(gap, {
        d,
        fill: 'none',
        stroke: '#fff', // Canvas-Hintergrundfarbe
        strokeWidth: 9,
        strokeLinecap: 'round',
        strokeLinejoin: 'round'
    });
    svgAppend(parentNode, gap);

    return base;
}


function toConnectionPath(waypoints = []) {
    if (waypoints.length === 0) return '';
    const [first, ...rest] = waypoints;
    return `M ${first.x},${first.y} ` + rest.map(p => `L ${p.x},${p.y}`).join(' ');
}



//helpers for creating the points for  a hexagon shape


//combines both helpers below
function widthHeightToPoints(width, height) {
    return widthHeightToPointObjects(width, height)
        .map(p => `${p.x},${p.y}`)
        .join(' ');
};

// returns 6 hexagon points as an object
function widthHeightToPointObjects(width, height, offsetX = 0, offsetY = 0) {

    return [
        { x: offsetX + width * 0.25, y: offsetY + 0 },
        { x: offsetX + width * 0.75, y: offsetY + 0 },
        { x: offsetX + width, y: offsetY + height / 2 },
        { x: offsetX + width * 0.75, y: offsetY + height },
        { x: offsetX + width * 0.25, y: offsetY + height },
        { x: offsetX + 0, y: offsetY + height / 2 }
    ];
}

//creates a hexagon shape for hitmarking 
function getHexagonPath(shape) {
    // getShapePath expects absolute coordinates in diagram space.
    const points = widthHeightToPointObjects(shape.width, shape.height, shape.x, shape.y);

    return [
        `M ${points[0].x},${points[0].y}`,
        `L ${points[1].x},${points[1].y}`,
        `L ${points[2].x},${points[2].y}`,
        `L ${points[3].x},${points[3].y}`,
        `L ${points[4].x},${points[4].y}`,
        `L ${points[5].x},${points[5].y}`,
        'Z'
    ].join(' ');
}



